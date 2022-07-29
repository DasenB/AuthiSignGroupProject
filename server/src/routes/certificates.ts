import express from "express";

import * as pkijs from "pkijs";
import * as pvutils from "pvutils";

import * as db from "../database";
import * as cert from "../certificate";

const router = express.Router();

router.get("/comment/:id", async (req, res) => {
    let { id } = req.params;
    let dbRes: Array<any>;

    try {
        dbRes = await db.conn("comments")
            .join("users", "comments.user", "users.id")
            .select("users.cert")
            .where("comments.id", id);
    } catch(err) {
        console.error("DB error when loading certificate.", id, err);
        return res.status(500).send("Error when loading the certificate from the database.");
    }

    if(dbRes.length == 0) {
        return res.status(404).send("Couldn't find a certificate for that comment id.");
    }

    res.send(dbRes[0].cert); 
});

router.get("/user/:id", async (req, res) => {
    let { id } = req.params;
    let dbRes: Array<any>;

    try {
        dbRes = await db.conn("users").select("cert").where({ id: id });
    } catch(err) {
        console.error("DB error when loading certificate.", id, err);
        return res.status(500).send("Error when loading the certificate from the database.");
    }

    if(dbRes.length == 0) {
        return res.status(404).send("Couldn't find a certificate for that user id.");
    }

    res.send(dbRes[0].cert);
});

export default router;