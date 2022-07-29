import '@testing-library/jest-dom';

import { render, fireEvent, screen, getByLabelText, getByTitle } from '@testing-library/svelte';

//importing the CertificateView throws errors as the chrome crypto module is undefined
//this is used to mock the crypto module
//IMPORTANT: has to be done BEFORE the CertificateView is imported
const crypto = require('crypto')
Object.defineProperty(global.self, "crypto", {
    value: {
        subtle: crypto.webcrypto.subtle,
    },
});
import CertificateView from '../certificate/CertificateView.svelte';

const Dexie = require('dexie')

Dexie.dependencies.indexedDB = require('fake-indexeddb')
Dexie.dependencies.IDBKeyRange = require('fake-indexeddb/lib/FDBKeyRange')


//this is required to mock the fetch function
// const fetch = require('node-fetch');
// globalThis.fetch = fetch

import * as cert from "../certificate/handler";

test('Login input Name and Email', async () => {
    // TODO: this test wont work as long as the chrome storage.session api is used
    // we have to mock that part but we cant do that as the mock package does not support the sessions from the api
    // we could use another mock package for chrome but that package only works with jest < 27.0 but we need 
    // jest > 28.0 for typescript to work  

    // const { container } = render(CertificateView);
    // const nameInput = getByLabelText(container, 'Name (from ORCiD)');
    // const emailInput = getByLabelText(container, 'E-Mail');

    // await fireEvent.input(nameInput, { target: { value: 'Max Mustermann' } });
    // await fireEvent.input(emailInput, { target: { value: 'max.mustermann@example.com' } });

    // expect((nameInput as HTMLInputElement).value).toContain('Max Mustermann');
    // expect((emailInput as HTMLInputElement).value).toContain('max.mustermann@example.com');
});


test('crypto handler functions return values should be defined', async () => {
    const keyPair = await cert.generateKeyPair();
    expect(keyPair).toBeDefined();
    const b64 = await cert.generateCSR(keyPair, '0000-0012-3456-789X', 'Max Mustermann', 'max.mustermann@example.com');
    expect(b64).toBeDefined();
});

