import express from "express";
import axios, { AxiosResponse } from "axios";

import * as db from "../database";
import * as cert from "../certificate";

import * as pkijs from "pkijs";
import * as pvutils from "pvutils";

import crypto from "crypto";

const router = express.Router();

type DocumentData = {
    id: number,
    url: string,
    version: number,
    hash: string
};

async function createDocument(url: string): Promise<number> {
    let dbRes: Array<number>;

    try {
        dbRes = await db.conn("documents").insert({
            url: url
        });
    } catch(err: any) {
        console.error("DB error when inserting document.", url, err);
        return null;
    }

    return dbRes[0];
}

async function createNewVersion(document: number, version: number, hash: string): Promise<number> {
    let dbRes: Array<number>;

    try {
        dbRes = await db.conn("versions").insert({
            document: document,
            version: version,
            hash: hash
        }); 
    } catch(err: any) {
        console.error("DB error when inserting document version.", document, version, hash, err);
        return null;
    }

    return dbRes[0];
}

async function getDocument(url: string): Promise<DocumentData> {
    if(!(url.startsWith("http://") || url.startsWith("https://"))) {
        return null;
    }

    let hash = await hashDocument(url);
    if(!hash) {
        return null;
    }

    let dbRes: Array<any>;

    try {
        dbRes = await db.conn("versions")
            .join("documents", "versions.document", "documents.id")
            .select("documents.id", "versions.version", "versions.hash")
            .where("documents.url", url)
            .orderBy("versions.version", "desc")
            .limit(1);
    } catch(err: any) {
        console.error("DB error when fetching data about the document.", url, err);
        return null;
    }

    if(dbRes.length == 0) {
        let id = await createDocument(url);
        if(!id) {
            return null;
        }
         
        let vId = await createNewVersion(id, 1, hash);
        if(!vId) {
            return null;
        }

        return {
            id: id,
            url: url,
            version: 1,
            hash: hash
        };
    } else {
        let data = dbRes[0];

        if(data.hash != hash) {
            let newVersion = data.version + 1;

            let vId = await createNewVersion(data.id, newVersion, hash);
            if(!vId) {
                return null;
            }
            
            return {
                id: data.id,
                url: url,
                version: newVersion,
                hash: hash
            };
        }

        return {
            id: data.id,
            url: url,
            version: data.version,
            hash: data.hash
        };
    }
}

async function hashDocument(url: string): Promise<string> {
    let res: AxiosResponse;

    try {
        res = await axios.get(url);
    } catch(err: any) {
        console.error("Error when downloading document during hashing.", url, err.code);
        return null;
    }

    return crypto.createHash("sha256").update(res.data).digest("base64");
}

router.post("/insert", async (req, res) => {
    let { user, url, comment } = req.body;

    let document = await getDocument(url);
    if(!document) {
        return res.status(500).send("Couldn't find valid document behind that URL.");
    }

    let userCert = await cert.getUserCert(user);
    if(!userCert) {
        return res.status(500).send("Couldn't find a certificate for that user id.");
    }

    let verificationEngine = new pkijs.CertificateChainValidationEngine({
        certs: [userCert],
        trustedCerts: [ cert.getCACert() ]
    });

    let verified = await verificationEngine.verify();
    if(!verified.result) {
        return res.status(403).send("Your certificate is not valid.");
    }

    let publicKey = await userCert.getPublicKey();
    if(!publicKey) {
        return res.status(500).send("Couldn't extract the public key from the certificate of the user.");
    }

    let signatureBase64 = req.body.signature;
    let signatureBuffer = pvutils.stringToArrayBuffer(pvutils.fromBase64(signatureBase64));
    let commentBase64 = pvutils.toBase64(comment);
    let commentBuffer = pvutils.stringToArrayBuffer(commentBase64);

    let match = await crypto.webcrypto.subtle.verify("RSASSA-PKCS1-v1_5", publicKey, signatureBuffer, commentBuffer);
    if(!match) {
        return res.status(500).send("Signature doesn't match.");
    }

    let timestamp = Date.now();
    let dbRes: Array<number>;
    
    try {
        dbRes = await db.conn("comments").insert({
            document: document.id,
            version: document.version,
            user: user,
            comment: comment,
            signature: signatureBase64,
            timestamp: timestamp
        });
    } catch(err: any) {
        console.error("DB error when inserting comment.", document, user, comment, signatureBase64, timestamp);
        return res.status(500).send("Error when inserting the comment to the database.");
    }
    
    res.send(dbRes[0].toString());
});

router.get("/get/id/:id", async (req, res) => {
    let { id } = req.params;
    let dbRes: Array<any>;

    try {
        dbRes = await db.conn("comments")
            .join("users", "comments.user", "users.id")
            .join("documents", "comments.document", "documents.id")
            .select("comments.id", "comments.comment", "comments.signature", "comments.timestamp", "comments.document", "comments.version", "users.id as userId", "users.name as userName", "documents.url")
            .where("comments.id", id);
    } catch(err: any) {
        console.error("DB error when fetching comment by id.", id, err);
        return res.status(500).send("Error when loading the comment from the database.");
    }
    
    if(dbRes.length == 0) {
        return res.status(404).send("Couldn't find a comment with the given id.");
    }

    let comment = dbRes[0];
    res.json({
        document: {
            id: comment.document,
            url: comment.url,
            version: comment.version
        },

        id: comment.id,
        comment: comment.comment,
        signature: comment.signature,
        timestamp: comment.timestamp,

        user: {
            id: comment.userId,
            name: comment.userName
        }
    });
});

router.get("/get/site/:url", async (req, res) => {
    let { url } = req.params;

    let document = await getDocument(url);
    if(!document) {
        return res.status(500).send("Couldn't find valid document behind that URL.");
    }

    let dbRes: Array<any>;

    try {
        dbRes = await db.conn("comments")
            .join("users", "comments.user", "users.id")
            .select("comments.id", "comments.comment", "comments.signature", "comments.timestamp", "comments.version", "users.id as userId", "users.name as userName")
            .where("comments.document", document.id);
    } catch(err) {
        console.error("DB error when fetching comments by document.", document);
        return res.status(500).end("Error when loading comments from the database.");
    }

    if(dbRes.length == 0) {
        return res.status(404).end("Couldn't find any comments for that document.");
    }

    res.json({
        document: document,
        comments: dbRes.map((c) => {
            return {
                id: c.id,
                comment: c.comment,
                signature: c.signature,
                timestamp: c.timestamp,
                version: c.version,

                user: {
                    id: c.userId,
                    name: c.userName
                }
            };
        })
    });
});

router.get("/get/user/:id", async (req, res) => {
    let { id } = req.params;
    let dbRes: Array<any>;

    try {
        dbRes = await db.conn("comments")
            .join("users", "comments.user", "users.id")
            .join("documents", "comments.document", "documents.id")
            .select("comments.id", "comments.comment", "comments.signature", "comments.timestamp", "comments.document", "comments.version", "users.id as userId", "users.name as userName", "documents.url")
            .where("users.id", id);
    } catch(err: any) {
        console.error("DB error when fetching comments by user.", id, err);
        return res.status(500).end("Error when loading comments from the database.");
    }

    if(dbRes.length == 0) {
        return res.status(404).end("Couldn't find any comments from that user id.");
    }

    res.json(dbRes.map((c) => {
        return {
            document: {
                id: c.document,
                url: c.url,
                version: c.version
            },

            id: c.id,
            comment: c.comment,
            signature: c.signature,
            timestamp: c.timestamp,

            user: {
                id: c.userId,
                name: c.userName
            }
        };
    }));
});

router.get("/get/orcid/:orcid", async (req, res) => {
    let { orcid } = req.params;
    let dbRes: Array<any>;

    try {
        dbRes = await db.conn("comments")
            .join("users", "comments.user", "users.id")
            .join("documents", "comments.document", "documents.id")
            .select("comments.id", "comments.comment", "comments.signature", "comments.timestamp", "comments.version", "users.id as userId", "users.name as userName", "documents.url", "comments.document")
            .where("users.orcid", orcid);
    } catch(err: any) {
        console.error("DB error when fetching comments by orcid.", orcid, err);
        return res.status(500).end("Error when loading comments from the database.");
    }

    if(dbRes.length == 0) {
        return res.status(404).end("Couldn't find any comments from that ORCiD.");
    }

    res.json(dbRes.map((c) => {
        return {
            document: {
                id: c.document,
                url: c.url,
                version: c.version
            },

            id: c.id,
            comment: c.comment,
            signature: c.signature,
            timestamp: c.timestamp,

            user: {
                id: c.userId,
                name: c.userName
            }
        };
    }));
});

export default router;