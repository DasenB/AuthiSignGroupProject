
const http = require('http');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const requestListener = function (req, res) {
    const publicKey = fs.readFileSync("./public.pem", { encoding: "utf8" });

    let token = ''
    let data = '';
    req.on('data', chunk => {
      data += chunk;
    });
    req.on('end', () => {
      let jsonreq = JSON.parse(data);
      token = JSON.parse(data).token;
      let orcidID = jsonreq.orcidID;

      let jsontoken = jwt.decode(token);
      console.log(jwt.verify(token, publicKey, { algorithms: ['RS256'] }));
      console.log(jsontoken.sub === orcidID);
      
      res.writeHead(200);
      res.end(token);
    });

}

const server = http.createServer(requestListener);
server.listen(8080);