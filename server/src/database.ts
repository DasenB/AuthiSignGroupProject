import fs from "fs";
import knex from "knex";

// Create res folder if needed
if(!fs.existsSync("res/")) {
    fs.mkdirSync("res/");
}

const conn = knex({
    client: "sqlite3",
    useNullAsDefault: true,

    connection: {
        filename: "./res/data.db"
    }
});

async function init() {
    if(!(await conn.schema.hasTable("users"))) {
        await conn.schema.createTable("users", (table) => {
            table.increments("id").primary();
            table.string("orcid");
            table.string("name");
            table.string("email");
            table.string("cert");
        });
    }

    if(!(await conn.schema.hasTable("documents"))) {
        await conn.schema.createTable("documents", (table) => {
            table.increments("id").primary();
            table.string("url");
        });
    }

    if(!(await conn.schema.hasTable("versions"))) {
        await conn.schema.createTable("versions", (table) => {
            table.integer("document").references("id").inTable("documents");
            table.integer("version");
            table.string("hash");

            table.primary(["document", "version"]);
        });
    }

    if(!(await conn.schema.hasTable("comments"))) {
        await conn.schema.createTable("comments", (table) => {
            table.integer("id").primary();
            table.integer("document");
            table.integer("version");
            table.integer("user").references("id").inTable("users");
            table.text("comment");
            table.string("signature");
            table.dateTime("timestamp");

            table.foreign(["document", "version"]).references(["document", "version"]).inTable("versions");
        });
    }
}

export { conn, init };