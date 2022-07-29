# API Documentation

## ORCID authentication API[^1]

files: [contentScript.js](../../client/public/contentScript.js), [sandbox.html](../../client/public/sandbox.html), [manifest.json](../../client/public/manifest.json), [background.ts](../../client/src/background.ts)

### Starting the login process
The orcid authentication widget can be shown to the user by calling the `createLoginTab()` method in `client/src/utils/tabCreator.ts`.
This opens a new tab which only shows the auth widget.

#### Further details
The auth widget must be sandboxed and is therefore included in `sandbox.html` which must be marked as a sandboxed page in `manifest.json`.
Additionally the manifest must define the following content security policy for sandboxes as follows:
```
  "content_security_policy": {
    "sandbox": "sandbox allow-scripts; script-src 'self'; script-src-elem 'self' https://code.jquery.com https://kjur.github.com https://kjur.github.io"
  },
```

The sandboxing is necessary because the login process includes a redirect to the orcid login page (-> foreign origin).
The content security policy is necessary because of the contents of the javascript code of the auth widget (i.e. it dynamically loads libraries from foreign origins).

<!-- ### Communication with ORCiD
After sending a request from the `sandbox.html` the user is forwarded to the ORCiD website. From there the standard login procedure of ORCiD starts. The user needs to pass his login data, i.e. email and password, to ORCiD. After logging in, the user will be redirected to the `sandbox.html` and the ORCiD information will be stored. Afterwards the communication with the extension can be established. -->

### Get data when logged in

On successful login, login data is stored in `chrome.session.storage` as a userData object and can be retrieved using `chrome.storage.session.get('userData')`. The user data object contains the following fields:

- orcidId: Contains the users orcid ID as a URI
- orcidGivenName: Contains the first name of the user
- orcidFamilyName: Contains the family name of the user
- orcidIdToken: Contains the oauth-token that was used for authentication

#### Further details

The used information is gathered in the following way: 
After sending a request from the `sandbox.html` the user is forwarded to the ORCiD website. From there the standard login procedure of ORCiD starts. The user needs to pass his login data, i.e. email and password, to ORCiD. 
After authentication the user is redirected to the `authentication page web server`. There, the data is filled into `hidden input fields`. These are then read by the `content script` which is injected into the web page by the extension. The content script then creates the userData object and sends a message to the extension. This message is read by the `background.ts` `service worker`.

The content script and service worker must be specified in the manifest.

---

## Project intern API[^2]

We need interfaces for the following:

### ORCID

ORCID data is aquired by the WEB2.0 group and is needed by the CS group to get the certificate.  
TODO: The data needed for the certificate might change during the project. This would result in these API Calls changing as well.

#### GET users/common_name

Returns the common name of the user specified by the `id` parameter.

##### Resource URL (Placeholder TODO)

https://api.project.com/1/users/common_name.json

##### Parameters

| **Name** | Required | Description | Default | Example
|---|---|---|---|---|
| **id** | required | The ID of the current user |  | 651894354

##### Example Request (Placeholder TODO)

GET https://api.project.com/1/users/common_name.json?id=651894354

##### Example Response

{ "common_name": "max" }

#### GET users/alternative_name

Returns the alternative names (emails) of the user specified by the `id` parameter.

##### Resource URL (Placeholder TODO)

https://api.project.com/1/users/alternative_name.json

##### Parameters

| **Name** | Required | Description | Default | Example
|---|---|---|---|---|
| **id** | required | The ID of the current user |  | 651894354

##### Example Request (Placeholder TODO)

GET https://api.project.com/1/users/alternative_name.json?id=651894354

##### Example Response

{ "alternative_names": ["max.mustermann@example.com", "m<span>ax.mustermann<span>@beispiel.com"] }

#### GET users/orcid

Returns the orcid id of the user specified by the `id` parameter.

##### Resource URL (Placeholder TODO)

https://api.project.com/1/users/orcid.json

##### Parameters

| **Name** | Required | Description | Default | Example
|---|---|---|---|---|
| **id** | required | The ID of the current user |  | 651894354

##### Example Request (Placeholder TODO)

GET https://api.project.com/1/users/orcid.json?id=651894354

##### Example Response

{ "orcid": "0000-0000-1234-5678" }

#### GET users/institution

Returns the institution of the user specified by the `id` parameter.

##### Resource URL (Placeholder TODO)

https://api.project.com/1/users/institution.json

##### Parameters

| **Name** | Required | Description | Default | Example
|---|---|---|---|---|
| **id** | required | The ID of the current user |  | 651894354

##### Example Request (Placeholder TODO)

GET https://api.project.com/1/users/institution.json?id=651894354

##### Example Response

{ "institution": "Universitaet Rostock" }

#### GET users/degree

Returns the degrees of the user specified by the `id` parameter.

##### Resource URL (Placeholder TODO)

https://api.project.com/1/users/degree.json

##### Parameters

| **Name** | Required | Description | Default | Example
|---|---|---|---|---|
| **id** | required | The ID of the current user |  | 651894354

##### Example Request (Placeholder TODO)

GET https://api.project.com/1/users/degree.json?id=651894354

##### Example Response

{ "degrees": ["Bachelor", "Master", "Doctoral"] }

### Certificate

WEB2.0 modules will save the certificates, therefore we need an interface to transfer them back and forth.

#### GET certificate

Returns the certificate of the user specified by the `id` parameter.  
The certificate will be encoded into base64 so it can fit into one line in a .json.  
The receiving end can decode it using base64 to get the same certificate with correct white spaces.

##### Resource URL (Placeholder TODO)

https://api.project.com/1/certificate.json

##### Parameters

| **Name** | Required | Description | Default | Example
|---|---|---|---|---|
| **orcid** | required | The orcid ID of the current user |  | 0000-0000-1234-5678

##### Example Request (Placeholder TODO)

GET https://api.project.com/1/certificate.json?orcid=0000-0000-1234-5678

##### Example Response

{ "certificate": "Here the base64 encoded certificate" }

### Comment

Comments will be written in modules that are managed by the WEB2.0 group. These comments are then going to be signed by CS modules. This means we have to send them to the relevant modules in one step.
In another step WEB2.0 modules will have to store the comments and certificates which means we also have to transfer the signed comment back.

#### POST comments/sign

Signs the comment.

##### Resource URL (Placeholder TODO)

https://api.project.com/1/comments/sign.json

##### Example Request (Placeholder TODO)

POST https://api.project.com/1/comments/sign.json

[^1]: Tom Siegl, Nico Trebbin, Marian Zuska
[^2]: Tim Markwardt, Jan Heisenberg