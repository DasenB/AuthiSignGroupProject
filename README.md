# Authi-Sign

Authi-Sign is an application that extends static content such as PDF-files or images with a comment-function. Furthermore the comments are coupled to the users ORCID account and signed with a private key to establish a strong connection between a comment and the author. The goal is to enable a scientific discussion in which the reputation of an author is inherently tied to its statements.

The chrome-extension automaticaly detects wehter a document is of type PDF, PNG or JPEG. If that is the case the documents hash is calculated and the hash is used to identify all comments in the database that exist for the given document. The comments are then loaded and the signatures are validated to make sure they have not been tempered with and actually represent the authors original message. A user also has the ability to write own comments for the document.



## Description
The architecture consists of  different parts:
  * Client (Browser Plugin)
  * Server 
  * Authentication server

## Client
  The client is a web app programmed in typescript around the svelte framework.
  There are different components:
    * certificate
    * controller 
    * dashboard
    * editor 
    * login 
    * reader 
    * main application


### Certificate
  In the certificate view, data from the `sessionStorage` was retrieved 
  with the key "userdata". The data object contains the ORCIDId and the 
  name of a user. The name and id are then put into the view.
  Also, the requestCertificate function is defined.
  In the function the name and email values are taken from the html dom.
  A key pair is generated with ORCID-ID, name and email.
  That key pair is encoded as base64 string.
  As result a request is done to another JSON-HTTP-API,
  where the json contained  by the body contains the ORCID-ID, name , email and said base64 string.
  On error return code nothing is done,
  a procedure to store the certificate and corresponding private and public
  key is called.

### Controller 
  There are two controllers for handling listing and updates on drafts and comments.
  The asynchronous function getCommment returns an anonymous object which implements
  IComment interface and contains ID, URL, the comment as a string, the signature,
  a timestamp and an author with id and name.
  The listUserComments function returns an array of those comments by user 
  given his orcid as a parameter.
  The listWebsiteComments lists all comments given by a url.
  The verifyComment function verifies if a comment has been signed.
  There are also functions to add and delete Comments.

### Dashboard
  There are multiple components included in the dashboard:
	* DashboardView
	* Draft
	* Comment
	* CommentPreview
 The `CommentPreview` is a subcomponent, that contains text and some metadata about the author and the date.
 The `Comment` component contains a `CommentPreview`, with the `isDraft` options set to false.
 The Draft component contains the `CommentPreview` and a button which creates a new tab to edit the draft.
 The `DashboardView` either shows UserComments, Drafts or SiteComments.
 In the component there are functions defined for reloading SiteComments,Drafts and UserComments, 
 and one for reloading them all together. 
 These are called: 
	* reloadSiteComments
	* reloadUserComments
	* listDrafts
	* reloadContent
 In the view the shown content can be switched between comments, drafts and comments by the user.

### Editor
  The editor is a view for editing and publishing comments.
  It consists of the `EditorView` which consists of a url view, 
  textarea and multiple buttons to interact with other websites.
  Multiple functions are defined:
	* handleSaveDraft (Saves Draft)
	* handleDeleteDraft (Deletes Draft)
	* handleSubmitDraft (Replaces Draft, by Comment)
	* showSuccessNotification (Select if a notification is shown)

### Login
  The `LoginView` is a simple view, that is used for login into ORCID.

### Reader
  The `ReaderView` is a small view, that consists of author and a date and the text.
  It is used in the AppView. 

### Main Application
  If the editor is enabled, an EditorView is shown, otherwise if a reader is enabled,
  a ReaderView is shown. If neither of both is enabled, an imprint is shown.
  If the user is logged in, some buttons are shown which are used for logging the user out and
  showing the dashboard. 

### Running

Follow the instructions to install the package.

#### Install required packages

To run the extension, you need to install the required packages **once**.  
Change into the `client` directory first and then run

```
npm install
```

You also need to install the orcid vendor widget submodule.
This only needs to be executed once for both the client and the server.

```
git submodule init
git submodule update
```

#### Run the extension

Again make sure, you are in the `client` directory.
Then you can start the client in development mode with

```
npm run dev
```

#### Load the extension:

1. Go to [chrome://extensions](chrome://extensions)
2. Enable **Developer Mode**
3. Click on **Load unpacked** and select `client/public`

![img](https://wd.imgix.net/image/BhuKGJaIeLNPW9ehns59NfwqKxF2/vOu7iPbaapkALed96rzN.png?auto=format&w=741)

To view the changes after editing the code, save your files and click on the refresh button on [chrome://extensions](chrome://extensions).

#### Testing 

For the testing of the extension we are using [jest](https://jestjs.io/).  
To start the tests move into the `client` directory and then run 

```
npm run test
```

## Server
  The server is a supplement to the client, it represents a JSON api, which is used by the client.
  The server is a express script which starts a webserver on the port 3000.
  There exist multiple different routes:
	* /certificates
	* /comments
	* /users  
	* /rests
	* /static

### Additional types
  Following additional type was defined:
	* webcrypto
	Generates a random UUID or a list of randomValue.

### Users 
  The `/users` route is implemented in the routeUsers function, which is implemented in the 
  file `routes/users.ts`.
  There are the following routes which can be used 
	* add (Post) 
	    This option is used when a user is added.
	* /id/<ORCID-ID> (Get)
	    This option is used for querying the ID, given the ORCID-ID.
	* /orcid/<ID> (Get)
	    This option is used for querying the ORCID-ID, given the ID.
	* /get/<ID> (Get)
	    This option queries the information of a user given the ID.

### Comments
 The `/comments` route is implemented in the routeComments function, which is implemented in the
 file `routes/comments.ts`
 The following routes were defined:
	* /insert (Post)
	   This function is defined for adding comments.
	* /get/id/<ID> (Get)
	   This route point is for fetching comments given a comment id.
	* /get/orcid/<ORCID> (Get)
	   Extract a comment by a given ORCID-ID.
	* /get/user/<ID> (Get)
	   Fetches comments given by a user.
	* /get/site/<URL> (Get)
	   Fetches documents of a website.
	

The utility function getDocument was defined to extract document data from the database,
given the URL.

### Certificates
The `certificates` route is implemented in the routeComments function,
which is implemented in the file `routes/comments.ts`

The certificates module uses these routes:
	* /comment/<ID> (Get)
	   Extract the user certificate, given a comment.
	* /user/<ID> (Get)
	   Extract the user certificate, given a user ID.
	
      
### Static
Under the `/static` route, the authentication page is served.
The authentication page is simply a webpage, where you can log yourself in,
which is a simple JavaScript and HTML page.

### Database
   As a database sqlite is used, which produces a file in the `res` directory.
   Initializing the database produces the following tables:
    * users:
	    Contains an ID, ORCID-ID, name, email and certificate.
	* documents:
	    Contains id and URL.
	* versions:
	    Contains document id (foreign key), version and hash.
	* comments:
	    Contains id, document, version, user, comment ,signature and timestamp.

### Certificates 
   This module either creates a CA certificate or loads it.
   There is also the function `getUserCert` defined for loading certificates by users.
   `createUserCert` creates a certificate for the user and stores it.

### Setting up the server

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


## Authentication server
  The authentication server is a service which provides authentication with 
  either yubikey or ORCiD, with nginx as a reverse proxy.
  The code can be found in the `authentication-server` directory of
  the repository.


### Configuring the ssl with nginx

In the `nginx/default.conf` file of the repository the names of the ssl certificates can be specified.
The the base path of those files are `/etc/ssl/certs/nginx`, make sure to configure the name accordingly.
The ssl certificates need to be saved into the `nginx/ssl` directory.
For example if *Letsencrypt* is used the certificates can be found under
the `/etc/letsencrypt/archive/<domain>` directory.
Also instead of copying the contents of the directory `/etc/letsencrypt/archive/<domain>`,
the directory can be symlinked to the `nginx/ssl` directory.

### ORCID authentication
The server is a node javascript which requires 
`http`, `jsonwebtoken` and `fs`.
The script implements a listener where data chunks 
are concatenated to each other.
The completed buffer will be decoded as jsontoken.
The `jsonwebtoken` is used to verify if the token
matches the public key encryption.

### Yubikey authentication server
The yubikey server is similarly implemented to the 
ORCID server. It is a https server where a key and certificate 
are provided.
The libraries `node:https`, `fs` and `fido2-lib` are used.
In the request, a challenge is decoded in UTF-8 as a public key object
and the object is sent as JSON decoded string in the body of the response.

### Building the docker service with docker compose. 

Finally then the service can be built with the following the command:
```sh
  docker compose build .
```
Usually the nginx image will be configured so that it will listen
on the default https port 443 and should be configured 
so it will redirect requests on the default http port 80 to 443.

