# Server

The server stores the certificates and the comments created by the users. All the data is stored inside the `res` folder. It will create it automatically if it doesn't exist.

## Certificate

On startup, the server will create a new `private key` with a self-signed (trusted) `CA-certificate` if there's none currently inside the `res` folder. This will be used to sign the `CSRs` by the users. Therefore it need's to be copied into the extension since it's needed for the verification. Temporarly it can be accessed via the API aswell.

## Database

The server uses a `sqlite` database, which is also located inside the `res` folder and will be automatically created on startup. You can view the contents of the file outside of the server with e.g. "DB Browser for SQLite" (<https://sqlitebrowser.org/>)

## Setup

To run the server, you need to have `node.js` (v16.7+) with the packages `typescript` and `ts-node` installed.

Install the required npm packages for this project:

    npm install

Install the orcid vendor widget (only needed once for both client and server):

    git submodule init
    git submodule update

Run the server:

    npx ts-node src/index.ts

You can also use `nodemon` to automatically refresh the server during active development:

    nodemon src/index.ts
