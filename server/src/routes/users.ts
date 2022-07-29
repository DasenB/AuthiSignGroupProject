import express from "express";

import * as pkijs from "pkijs";
import * as pvutils from "pvutils";

import * as db from "../database";
import * as cert from "../certificate";

const router = express.Router();

router.post("/add", async (req, res) => {
    let { orcid, name, email } = req.body;
    
    let csrBase64 = req.body.csr;
    let csrString = pvutils.fromBase64(csrBase64);
    let csrBuffer = pvutils.stringToArrayBuffer(csrString);

    let csr: pkijs.CertificationRequest;
    let userCert: pkijs.Certificate;

    try {
        csr = pkijs.CertificationRequest.fromBER(csrBuffer);
    } catch(err: any) {
        console.error("Error when parsing the CSR.", orcid, name, email);
        return res.status(500).send("Error when parsing the CSR.");
    }

    try {
        userCert = await cert.createUserCert(csr);
    } catch(err: any) {
        console.error("Error when creating the user certificate.", orcid, name, email);
        return res.status(500).send("Error when creating the user certificate.");
    }

    let userCertBuffer = userCert.toSchema().toBER(false);
    let userCertString = pvutils.arrayBufferToString(userCertBuffer);
    let userCertBase64 = pvutils.toBase64(userCertString);

    let dbRes: Array<number>;

    try {
        dbRes = await db.conn("users").insert({ orcid: orcid, name: name, email: email, cert: userCertBase64 });
    } catch(err: any) {
        console.error("DB error when inserting user.", orcid, name, email, userCertBase64);
        return res.status(500).send("Error when creating the user.");
    }

    let caCert = cert.getCACert();
    let caSchema = caCert.toSchema().toBER(false);
    let caString = pvutils.arrayBufferToString(caSchema);
    let caB64 = pvutils.toBase64(caString);
    
    res.json({
        id: dbRes[0],
        cert: userCertBase64,
        root: caB64
    });
});

router.get("/get/:id", async (req, res) => {
    let { id } = req.params;
    let dbRes: Array<any>;

    try {
        dbRes = await db.conn("users").where({ id: id });
    } catch(err) {
        console.error("DB error when fetching user data.", id, err);
        return res.status(500).send("Error when loading user data from the database.");
    }

    if(dbRes.length == 0) {
        return res.status(404).send("Couldn't find a user with that id.");
    }

    res.json(dbRes[0]);
});

router.get("/id/:orcid", async (req, res) => {
    let { orcid } = req.params;
    let dbRes: Array<any>;

    try {
        dbRes = await db.conn("users").select("id").where({ orcid: orcid });
    } catch(err) {
        console.error("DB error when fetching ids.", orcid);
        return res.status(500).send("Error when loading user data from the database.");
    }

    if(dbRes.length == 0) {
        return res.status(404).send("Couldn't find a user id with that ORCiD.");
    }

    res.json(dbRes.map((d) => d.id));
});

router.get("/orcid/:id", async (req, res) => {
    let { id } = req.params;
    let dbRes: Array<any>;

    try {
        dbRes = await db.conn("users").select("orcid").where({ id: id });
    } catch(err) {
        console.error("DB error when fetching orcid.", id);
        return res.status(500).send("Error when loading user data from the database.");
    }

    if(dbRes.length == 0) {
        return res.status(404).send("Couldn't find an ORCiD behind that user id.");
    }
    
    res.send(dbRes[0].orcid);
});

export default router;