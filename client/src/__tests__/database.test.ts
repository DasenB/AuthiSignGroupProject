import '@testing-library/jest-dom';

import { render, fireEvent, getByLabelText, getByTitle } from '@testing-library/svelte';

//importing the CertificateView throws errors as the chrome crypto module is undefined
//this is used to mock the crypto module
//IMPORTANT: has to be done BEFORE the CertificateView is imported
const crypto = require('crypto')
Object.defineProperty(global.self, "crypto", {
    value: {
        subtle: crypto.webcrypto.subtle,
    },
});


const Dexie = require('dexie')

Dexie.dependencies.indexedDB = require('fake-indexeddb')
Dexie.dependencies.IDBKeyRange = require('fake-indexeddb/lib/FDBKeyRange')

import * as subclass from "../db";
import * as cert from "../certificate/handler";
import * as pvutils from "pvutils";


test('Test storing and creation of certificate', async () => {
    const subclassDexie = new subclass.MySubClassedDexie();
    const keyPair = await cert.generateKeyPair();
    const csr = await cert.generateCSR(keyPair, '0000-0012-3456-7895', 'Max Mustermann', 'max.mustermann@example.com');

    const csrBuffer = csr.toSchema().toBER(false);
    const csrString = pvutils.arrayBufferToString(csrBuffer);
    const csrBase64 = pvutils.toBase64(csrString);

    const certificate = JSON.stringify({
        orcid: '0000-0012-3456-7895',
        name: 'Max Mustermann',
        email: 'max.mustermann@example.com',
        csr: csrBase64,
    });

    expect(await subclassDexie.hasCertificate()).toBeFalsy();
    await subclassDexie.storeCertificate(12345, keyPair.privateKey, certificate, null);
    expect(await subclassDexie.hasCertificate()).toBeTruthy();

    // const keyCertData = await subclassDexie.getKeyCertData()
    //TODO: testing to create the certificate 
    //it throws an error "AsnError: Cannot create 'Certificate' from ASN.1 object"
});