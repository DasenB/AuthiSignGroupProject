import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import * as db from "./database";
import * as certificate from "./certificate";

import * as pvutils from "pvutils";

import routeCertificates from "./routes/certificates";
import routeComments from "./routes/comments";
import routeUsers from "./routes/users";

const app = express();
app.use(cors()); // temporary solution
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("Hello World");
});

// Static content delivery
app.use(express.static(__dirname + "/static"));

// Debug route to reset database
app.get("/reset", async (req, res) => {
    try {
        await db.conn.schema.dropTable("comments");
        await db.conn.schema.dropTable("versions");
        await db.conn.schema.dropTable("documents");
        await db.conn.schema.dropTable("users");

        res.send("ok");
    }
    catch(err) {
        res.status(500).json(err);
    }
});

app.use("/certificates", routeCertificates);
app.use("/comments", routeComments);
app.use("/users", routeUsers);

export default app;