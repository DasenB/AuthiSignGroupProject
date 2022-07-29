import * as asn1js from "asn1js";
import * as pkijs from "pkijs";
import * as pvutils from "pvutils";

// Get the chrome crypto module
let crypto = window.crypto.subtle;

// Generate a public/private key pair on the local machine
export async function generateKeyPair() {
    let keyPair = await crypto.generateKey({
        name: "RSASSA-PKCS1-v1_5",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256"
    }, true, ["sign", "verify"]);

    return keyPair;
}

export async function generateCSR(keyPair: CryptoKeyPair, orcid: string, name: string, email: string = "") {
    // Create the CSR and add the common name (in this case the real name of the person)
    let csr = new pkijs.CertificationRequest();
    csr.subject.typesAndValues.push(new pkijs.AttributeTypeAndValue({
        type: "2.5.4.3",
        value: new asn1js.PrintableString({ value: orcid + " - " + name })
    }));

    // Create the array with the extensions
    let extensions = [];

    // Add email as alternative name, if it exists
    // TODO: maybe check if email is valid
    if(typeof(email) == "string" && email.length > 0) {
        extensions.push(new pkijs.Extension({
            extnID: "2.5.29.17",
            critical: true,
            extnValue: new pkijs.GeneralNames({
                names: [
                    new pkijs.GeneralName({ type: 1, value: email }),
                    // ...
                ]
            }).toSchema().toBER(false)
        }));
    }

    // Add the extensions to the CSR
    csr.attributes = [];
    csr.attributes.push(new pkijs.Attribute({
        type: "1.2.840.113549.1.9.14",
        values: [new pkijs.Extensions({ extensions: extensions }).toSchema()]
    }));

    // Import public key and sign the certificate
    await csr.subjectPublicKeyInfo.importKey(keyPair.publicKey);
    await csr.sign(keyPair.privateKey, "SHA-256");

    return csr;
}