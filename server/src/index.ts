import * as db from "./database";
import * as cert from "./certificate";
import app from "./web";

async function init() {
    await db.init();
    await cert.init();
    
    app.listen(3000, () => {
        console.log("Web server listening on port 3000.");
    });
}

init();