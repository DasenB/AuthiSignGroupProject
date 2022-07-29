const https = require('node:https')
const fs = require('fs')
const {Fido2Lib } = require("fido2-lib");
const options = {
    key: fs.readFileSync('localhost-key.pem'),
    cert: fs.readFileSync('localhost.pem'),
}

const requestListener = function (req, res) {
    
    res.writeHead(200, {"Access-Control-Allow-Origin": "*"});

    f2l.attestationOptions()
       .then((options) => {

            var dec = new TextDecoder("utf-8");
            options.challenge = dec.decode(new Uint8Array(options.challenge));

            pubKeyObj = {"publicKey":options};
            
            console.log(pubKeyObj);
            res.write(JSON.stringify(pubKeyObj));
        })
       .then((val) => res.end());
     
 
    //res.write(JSON.stringify(registrationOptions));
    // make sure to add registrationOptions.user.id
    // save the challenge in the session information...
    // send registrationOptions to client and pass them in to `navigator.credentials.create()`...
    // get response back from client (clientAttestationResponse)


    const attestationExpectations = {
        challenge: "33EHav-jZ1v9qwH783aU-j0ARx6r5o-YHh-wd7C6jPbd7Wh6ytbIZosIIACehwf9-s6hXhySHO-HHUjEwZS29w",
        origin: "http://localhost/yubikey",
        factor: "either"
    };
    //const regResult = await f2l.attestationResult(clientAttestationResponse, attestationExpectations); // will throw on error

    // registration complete!
    // save publicKey and counter from regResult to user's info for future authentication calls

}

const f2l = new Fido2Lib({
    challengeSize: 128
});



const server = https.createServer(options, requestListener);
//port 8443
server.listen(8080);