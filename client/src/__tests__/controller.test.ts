import '@testing-library/jest-dom';

import { getComment } from '../controller/commentController';

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

test('Get comment', async () => {
    const undefinedComment = await getComment(undefined);
    expect(undefinedComment).toBeUndefined();
});