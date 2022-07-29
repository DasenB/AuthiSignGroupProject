// TODO: change domain to something from a config
// TODO: change IComment to save user id and other document metadata

import * as pkijs from "pkijs";
import * as pvutils from "pvutils";
import { db } from "../db";

export async function getComment(id: number): Promise<IComment> {
    let res: Response;

    try {
        res = await fetch("http://localhost:3000/comments/get/id/" + id, {
            headers: { "Content-Type": "application/json" },
            method: "GET"
        });
    } catch(err: any) {
        console.log("Error when fetching unique comment: " + err.code);
        return undefined;
    }

    if(res.status != 200) {
        let message = await res.text();
        console.log(res.status + " " + message);
        
        return undefined;
    }

    let data = await res.json();

    return {
        id: data.id,
        url: data.url,
        text: data.comment,
        signature: data.signature,
        date: new Date(data.timestamp),

        author: {
            id: data.user.id,
            name: data.user.name
        }
    }
}

export async function listUserComments(orcid: string): Promise<IComment[]> {
    let res: Response;

    try {
        res = await fetch("http://localhost:3000/comments/get/orcid/" + orcid, {
            headers: { "Content-Type": "application/json" },
            method: "GET"
        });
    } catch(err: any) {
        console.log("Error when fetching user comments: " + err.code);
        return undefined;
    }
    
    if(res.status != 200) {
        let message = await res.text();
        console.log(res.status + " " + message);

        return undefined;
    }

    let data = await res.json();

    return data.map((r) => {
        return {
            id: r.id,
            url: r.document.url,
            text: r.comment,
            signature: r.signature,
            date: new Date(r.timestamp),
    
            author: {
                id: r.user.id,
                name: r.user.name
            }
        }
    });
}

export async function listWebsiteComments(url: string): Promise<IComment[]> {
    let res: Response;

    try {
        res = await fetch("http://localhost:3000/comments/get/site/" + encodeURIComponent(url), {
            headers: { "Content-Type": "application/json" },
            method: "GET"
        });
    } catch(err: any) {
        console.error("Error when fetching website comments: " + err.code);
        return undefined;
    }

    if(res.status != 200) {
        let message = await res.text();
        console.log(res.status + " " + message);

        return undefined;
    }

    let data = await res.json();

    return data.comments.map((r) => {
        return {
            id: r.id,
            url: data.document.url,
            text: r.comment,
            signature: r.signature,
            date: new Date(r.timestamp),

            author: {
                id: r.user.id,
                name: r.user.name
            }
        }
    });
}

export async function verifyComment(comment: IComment): Promise<boolean> {
    let res: Response;

    // Get certificate from the user
    try {
        res = await fetch("http://localhost:3000/certificates/user/" + comment.author.id, {
            headers: { "Content-Type": "text/html" },
            method: "GET"
        });
    } catch(err: any) {
        console.error("Error when fetching website comments: " + err.code);
        return false;
    }

    let certBase64 = await res.text();
    let certString = pvutils.fromBase64(certBase64);
    let certBuffer = pvutils.stringToArrayBuffer(certString);

    let cert: pkijs.Certificate;

    try {
        cert = pkijs.Certificate.fromBER(certBuffer);
    } catch(err: any) {
        console.error("Error when parsing the certificate.");
        return false;
    }

    let publicKey = await cert.getPublicKey();
    let signatureBuffer = pvutils.stringToArrayBuffer(pvutils.fromBase64(comment.signature));
    let commentBase64 = pvutils.toBase64(comment.text);
    let commentBuffer = pvutils.stringToArrayBuffer(commentBase64);

    let match = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", publicKey, signatureBuffer, commentBuffer);
    if(!match) {
        return false;
    }

    let certData = await db.getKeyCertData();
    let verificationEngine = new pkijs.CertificateChainValidationEngine({
        certs: [cert],
        trustedCerts: [ certData.root ]
    });
    
    let verified = await verificationEngine.verify();
    return verified.result;
}

export async function addCommentFromDraft(draft: IDraft): Promise<number> {
    return addComment(draft.url, draft.text);
}

// could alternatively return whole IComment
export async function addComment(url: string, comment: string): Promise<number> {
    let keyCert = await db.getKeyCertData();
    if(!keyCert) {
        return undefined;
    }
    
    let commentBase64 = pvutils.toBase64(comment);
    let commentBuffer = pvutils.stringToArrayBuffer(commentBase64);

    let signatureBuffer = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", keyCert.key, commentBuffer);
    let signatureString = pvutils.arrayBufferToString(signatureBuffer);
    let signatureBase64 = pvutils.toBase64(signatureString);

    let res: Response;

    try {
        res = await fetch("http://localhost:3000/comments/insert", {
            headers: { "Content-Type": "application/json" },
            method: "POST",

            body: JSON.stringify({
                user: keyCert.id,
                url: url,
                comment: comment,
                signature: signatureBase64,
            })
        });
    } catch(err: any) {
        console.error("Error when inserting comment: " + err.code);
        return undefined;
    }

    if(res.status != 200) {
        return undefined;
    }

    let data = await res.text();
    let id = parseInt(data);

    return !isNaN(id) ? id : undefined;
}

export function deleteComment(id): boolean {
    return undefined;
}

// Comments do most likely not need update functionality
