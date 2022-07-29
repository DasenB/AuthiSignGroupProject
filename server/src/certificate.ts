import * as asn1js from "asn1js";
import * as pkijs from "pkijs";
import * as pvutils from "pvutils";

import { webcrypto } from "crypto";

import fs from "fs";
import * as db from "./database";

// Create res folder if needed
if(!fs.existsSync("res/")) {
    fs.mkdirSync("res/");
}

let crypto = webcrypto.subtle;
pkijs.setEngine("engine", new pkijs.CryptoEngine({ name: "engine", crypto: webcrypto }));

let privKey: CryptoKey, pubKey: CryptoKey;
let certificate: pkijs.Certificate;

let names = [
    { type: "2.5.4.6", value: "DE" },
    { type: "2.5.4.8", value: "Mecklenburg-Vorpommern" },
    { type: "2.5.4.7", value: "Rostock" },
    { type: "2.5.4.10", value: "University of Rostock" },
    { type: "2.5.4.11", value: "Lehrstuhl Informations- und Kommunikationsdienste" },
    { type: "2.5.4.3", value: "Authentication for Signing" }
];

let caTypeValues = names.map((name) => {
    let asn1String = new asn1js.PrintableString({ value: name.value });
    let typeAndValue = new pkijs.AttributeTypeAndValue({ type: name.type, value: asn1String });

    return typeAndValue;
});

async function createCACert() {
    await generateKeyPair();

    certificate = new pkijs.Certificate();

    certificate.version = 2;
    certificate.serialNumber = new asn1js.Integer({ value: 0 });
    certificate.extensions = [];

    certificate.issuer.typesAndValues = caTypeValues;
    certificate.subject.typesAndValues = caTypeValues;

    let from = new Date(), to = new Date();
    to.setUTCFullYear(to.getUTCFullYear() + 10);
    certificate.notBefore.value = from;
    certificate.notAfter.value = to;

    let keyHash = await crypto.digest({ name: "SHA-256" }, certificate.subjectPublicKeyInfo.subjectPublicKey.valueBlock.valueHexView);
    let keyHashOctet = new asn1js.OctetString({ valueHex: keyHash });

    // Subject Key Identifier
    certificate.extensions.push(new pkijs.Extension({
        extnID: "2.5.29.14",
        critical: false,
        extnValue: keyHashOctet.toBER(false)
    }));

    // Authority Key Identifier
    certificate.extensions.push(new pkijs.Extension({
        extnID: "2.5.29.35",
        critical: false,
        extnValue: new pkijs.AuthorityKeyIdentifier({
            authorityCertSerialNumber: new asn1js.Integer({ value: certificate.serialNumber.valueBlock.valueDec }),
            keyIdentifier: keyHashOctet
        }).toSchema().toBER(false)
    }));

    let basicAttr = new pkijs.BasicConstraints({ cA: true, pathLenConstraint: 0 });
    certificate.extensions.push(new pkijs.Extension({
        extnID: "2.5.29.19",
        critical: true,
        extnValue: basicAttr.toSchema().toBER(false),
        parsedValue: basicAttr
    }));

    let bitArray = new Uint8Array([0]);
    bitArray[0] |= 0x02; // cRLSign
    bitArray[0] |= 0x04; // keyCertSign
    bitArray[0] |= 0x40; // nonRepudiation
    bitArray[0] |= 0x80; // digitalSignature

    let keyUsage = new asn1js.BitString({ valueHex: bitArray });
    certificate.extensions.push(new pkijs.Extension({
        extnID: "2.5.29.15",
        critical: false,
        extnValue: keyUsage.toBER(false),
        parsedValue: keyUsage
    }));

    await certificate.subjectPublicKeyInfo.importKey(pubKey);
    await certificate.sign(privKey, "SHA-256");

    let certString = toFormattedBase64(certificate.toString("base64"), "CERTIFICATE");
    fs.writeFileSync("res/ca/cert.crt", certString);

    console.log("Created self signed CA certificate.");
}

async function createUserCert(csr: pkijs.CertificationRequest) {
    let userCert = new pkijs.Certificate();
    userCert.version = 2;
    userCert.serialNumber = new asn1js.Integer({ value: 0 });
    userCert.extensions = [];

    userCert.issuer.typesAndValues = caTypeValues;
    userCert.subject.typesAndValues = csr.subject.typesAndValues;

    let from = new Date(), to = new Date();
    to.setUTCFullYear(to.getUTCFullYear() + 1);
    userCert.notBefore.value = from;
    userCert.notAfter.value = to;

    let basicAttr = new pkijs.BasicConstraints({ cA: false });
    userCert.extensions.push(new pkijs.Extension({
        extnID: "2.5.29.19",
        critical: true,
        extnValue: basicAttr.toSchema().toBER(false),
        parsedValue: basicAttr
    }));

    let bitArray = new Uint8Array([0]);
    bitArray[0] |= 0x40; // nonRepudiation
    bitArray[0] |= 0x80; // digitalSignature

    let keyUsage = new asn1js.BitString({ valueHex: bitArray });
    userCert.extensions.push(new pkijs.Extension({
        extnID: "2.5.29.15",
        critical: false,
        extnValue: keyUsage.toBER(false),
        parsedValue: keyUsage
    }));

    let userKey = await csr.getPublicKey();
    await userCert.subjectPublicKeyInfo.importKey(userKey);
    await userCert.sign(privKey, "SHA-256");

    return userCert;
}

async function generateKeyPair() {
    let keyPair = await crypto.generateKey({
        name: "RSASSA-PKCS1-v1_5",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
    }, true, ["sign", "verify"]);

    privKey = keyPair.privateKey;
    pubKey = keyPair.publicKey;

    let privBuffer = await crypto.exportKey("pkcs8", privKey);
    let privString = toFormattedBase64(privBuffer, "PRIVATE KEY");
    fs.writeFileSync("res/ca/key.pem", privString);

    console.log("Created key pair.");
}

function toFormattedBase64(input: ArrayBuffer | string, title: string) {
    let b64 = input instanceof ArrayBuffer ? Buffer.from(input).toString("base64") : input;
    let formatted = "", index = 0;

    let header = "-----BEGIN " + title + "-----";
    let footer = "-----END " + title + "-----";

    do {
        let amount = Math.min(64, b64.length - index);
        formatted += b64.slice(index, index + amount) + "\r\n";
        index += amount;
    }
    while(index < b64.length);

    return header + "\r\n" + formatted + footer;
}

function toBuffer(input: string, title: string) {
    let header = "-----BEGIN " + title + "-----";
    let footer = "-----END " + title + "-----";
    input = input.replace("\r\n", "");

    let contents = input.substring(header.length, input.length - footer.length);
    let buffer = Buffer.from(contents, "base64");

    return buffer;
}

function getCACert() {
    return certificate;
}

async function getUserCert(id: number) {
    let res: Array<any>;

    try {
        res = await db.conn("users").select("cert").where("id", id);
    } catch(err: any) {
        console.error("DB error when fetching user certificate.", id, err);
        return null;
    }

    let certBase64 = res[0].cert;
    let certString = pvutils.fromBase64(certBase64);
    let certBuffer = pvutils.stringToArrayBuffer(certString);

    let cert: pkijs.Certificate;

    try {
        cert = pkijs.Certificate.fromBER(certBuffer);
    } catch(err: any) {
        console.error("Error when creating certificate object with PKI.js.", id, err);
        return null;
    }

    return cert;
}

async function loadCACert() {
    let keyData = fs.readFileSync("res/ca/key.pem", { encoding: "ascii" });
    let keyBuffer = toBuffer(keyData, "PRIVATE KEY");
    privKey = await crypto.importKey("pkcs8", keyBuffer, { 
        hash: "SHA-256",
        name: "RSASSA-PKCS1-v1_5",
    }, true, ["sign"]);

    let certData = fs.readFileSync("res/ca/cert.crt", { encoding: "ascii" });
    let certBuffer = toBuffer(certData, "CERTIFICATE");
    let asnData = asn1js.fromBER(certBuffer);
    certificate = new pkijs.Certificate({ schema: asnData.result });
    pubKey = await certificate.getPublicKey();

    console.log("Loaded CA certificate with private key.");
}

async function init() {
    if(!fs.existsSync("res/ca/key.pem") || !fs.existsSync("res/ca/cert.crt")) {
        if(!fs.existsSync("res/ca/")) {
            if(!fs.existsSync("res/")) {
                fs.mkdirSync("res");
            }
    
            fs.mkdirSync("res/ca");
        }

        await createCACert();
    } else {
        await loadCACert();
    }
}

export { createUserCert, getCACert, getUserCert, init };