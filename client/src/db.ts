import Dexie, { Table } from "dexie";

import * as pvutils from "pvutils";
import * as pkijs from "pkijs";

type KeyCertData = {
  id: number,
  key: CryptoKey,
  cert: pkijs.Certificate,
  root: pkijs.Certificate
};

export class MySubClassedDexie extends Dexie {
  drafts!: Table<IDraft>;
  keyCert!: Table<any>;

  constructor() {
    super("authi-sign");

    this.version(11).stores({
      drafts: "&id, url, date, text",
      keyCert: "&id, key, certificate, root",
    });
  }

  async getKeyCertData(): Promise<KeyCertData> {
    let entry = await db.keyCert.toCollection().last();

    try {
      let certBase64 = entry.certificate;
      let certString = pvutils.fromBase64(certBase64);
      let certBuffer = pvutils.stringToArrayBuffer(certString);
      let cert = pkijs.Certificate.fromBER(certBuffer);

      let rootBase64 = entry.root;
      let rootString = pvutils.fromBase64(rootBase64);
      let rootBuffer = pvutils.stringToArrayBuffer(rootString);
      let root = pkijs.Certificate.fromBER(rootBuffer);

      return {
        id: entry.id,
        key: entry.key,
        cert: cert,
        root: root
      };
    } catch(err) {
      console.log(err);
      return null;
    }
  }

  async hasCertificate() {
    let count = await db.keyCert.count();
    return count >= 1;
  }

  async storeCertificate(id: number, key: CryptoKey, certificate: string, root: string) {
    await this.keyCert.add({
      id: id,
      key: key,
      certificate: certificate,
      root: root
    });
  }
}

export const db = new MySubClassedDexie();
