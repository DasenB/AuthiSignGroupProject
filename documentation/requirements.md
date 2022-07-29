# Requirements

This document aims to describe the requirements for the common project of the modules 'Cybersecurity' and 'Web 2.0'. The contents of this document are subject to constant changes following discussions during the lecture as well as general extensions or new findings by the different groups of the project.

The project is mainly separated into two parts. The students of Web 2.0's main concerns lie with the UI of the product and everything regarding the browser, additionally they will provide a backend for storing comments/reviews. The students of Cybersecurity's main focus lies with security and cryptography, i.e., the authentication with ORCID and the CA.

Some overlap exists when it comes to the client-side storage of certificates.

## Cybersecurity

### Scope

- The immediate goal should be the implementation of a minimal viable product, i.e., an extension facilitating the authenticated signing of reviews/comments
- In the end, the product should be operational and well documented
- Further extensions such as implementing reputation management and EigenTrust would be suitable topics for future master theses

![A diagram showcasing the step-by-step workflow for signing and checking reviews/comments](https://github.com/clecap/authi-sign-lecture/blob/main/doc/Workflow.png)

### Use-Cases

This section describes the various ways in which the final product will, can and should be used by it's actors. These are, in numbers four, firstly the *Reviewer*, the *Reader*, a trusted third party acting as *Certificate Authority* (CA) and *ORCID*, an external service provider. Both *Reviewer* and *Reader* are collectively referred to as *Users* who, like *ORCID*, are extrinsic to the product. The CA, on the other hand is an intrinsic, yet independent, component of our product. For clarities sake, these actors will be written capitalized for the remainder of this document.

| **U01** | Authenticate with ORCID |
|---|---|
| **Actors** | Reviewer, ORCID |
| **Flow** | Reviewer authenticates themselves with ORCID using their credentials. ORCID, in turn, supplies an auth-token to the User which is stored client-side by the extension. |
| **Preconditions** | The Reviewer has an ORCID account |

| **U02** | Generate Key Pair |
|---|---|
| **Actors** | Reviewer |
| **Flow** | The reviewer generates both a public and private key with a suitable cryptographic scheme. Both are stored client-side by the extension. |
| **Preconditions** | - |


| **U03** | Send Certificate Signing Request |
|---|---|
| **Actors** | Reviewer, CA |
| **Flow** | Reviewer sends a Certificate Signing Request (CSR) to the CA. The CSR contains the Reviewer's public key, auth-token, ORCID id and potentially further identifying information such as email addresses. |
| **Preconditions** | The Reviewer has successfully authenticated with ORCID |

| **U04** | Confirm Identity |
|---|---|
| **Actors** | CA, ORCID |
| **Flow** | The CA sends a confirm identity request, containing an auth-token and ORCID id, to ORCID. ORCID, in the response, either confirms or denies the identity. |
| **Preconditions** | The CA has received a CSR from a Reviewer. |

| **U05** | Grant Certificate |
|---|---|
| **Actors** | CA, Reviewer |
| **Flow** | The CA creates, stores and sends a certificate to the Reviewer. The certificate contains the Reviewer's signed public key, ORCID id and potentially further identifying information. |
| **Preconditions** | Reviewer has sent CSR and CA confirmed Reviewer's identity. |

| **U06** | Generate Signature |
|---|---|
| **Actors** | Reviewer |
| **Flow** | Given a review/comment authored by the Reviewer, they generate a signature for this review/comment. The system generates and cryptographically signs a digest of the review/comment with the Reviewer's private key. |
| **Preconditions** | Reviewer has been granted a certificate by the CA. |

| **U07** | Check Authenticity |
|---|---|
| **Actors** | Reader |
| **Flow** | A Reader checks the authenticity of a review/comment by generating it's digest and comparing it with the deciphered signature. |
| **Preconditions** | The Reader possesses the Reviewer's public key.  |

### Non-Functional Requirements

The project should by well documented. That includes a user and a developer documentation. The former giving instructions on how to install and use the system, while the latter provides information regarding the individual components and their respective implementations.
The user documentation is a text document, preferably as a web page (markdown or html) or as a pdf, 
which includes walk-throughs of the final product as well.
The user documentation is the divided in a part for administrators and a part for the browser plugin.
Former provides instructions for setting up the server and a CA and includes information on how to set parameters (for example database configuration).

### What-If Scenarios

* Group size reduction due to students falling ill, quitting the course, etc.
	* It will have to be evaluated, if the current scope of the project is still realistic. If not, some features might have to be scrapped.
	* Some students can switch groups, if one specific group is lacking members.
* Change in COVID regulations
	* If new regulations make it impossible to have physical lectures/exercises, those could be changed to Zoom meetings.
* New features are added to the requirements
	* It will have to be evaluated, if the implementation of additional features is manageable. If so, it will have to be discussed in which group's general tasks the new features fit into.


## Web 2.0

| **U01** | Viewing The Extension |
|---|---|
| **Actors** | Extension, User |
| **Flow** | An icon is displayed in the browsers menubar. When the user clicks on the icon the extension is displayed. The icon visually indicates wether the document currently displayed by the brwoser can be commented on or not. |
| **Preconditions** | - |

| **U02** | Identifying Documents |
|---|---|
| **Actors** | Extension, DB |
| **Flow** | The extension calculates the sha256-hash of the document displayed in the browser. The hash is used as identifier in the database for information related to the displayed document. |
| **Preconditions** | The displayed document is of type: PDF, PNG, JPEG |

| **U03** | Loading Comments |
|---|---|
| **Actors** | Extension, DB |
| **Flow** | The calculated document identifier is used to request related comments from the database. |
| **Preconditions** | A document identifier has been calculated. |

| **U04** | Displaying Comments |
|---|---|
| **Actors** | Extension, User |
| **Flow** | The signature of a comment is validated. Only comments with a valid signature are displayed. For each comment the content and the author are displayed. A link to the OrcchID-page of the author is provided. A user does not need to be logged in to view comments. |
| **Preconditions** | The user has opened the comment view. |

| **U05** | Writing Comments |
|---|---|
| **Actors** | Extension, User |
| **Flow** | A user can write comments that consist of plain text. When a user started editing, the state of the comment-input-element is saved continously on the local machine and persists over multiple editing sessions. |
| **Optional** | Extend the comments to consist of rich text. |
| **Preconditions** | The user needs to be logged in with an OrchID-account. |

| **U06** | Submitting Comments |
|---|---|
| **Actors** | Extension, User, DB |
| **Flow** | After writing the comment the user can click a button to submit the comment. After clicking the button the user must authenticate by providing the password for its public/private-keypair. If the password is correct the comment is signed and send to the DB. Otherwise the user can retry to enter the password correctly. |
| **Preconditions** | The user needs to be logged in with an OrchID-account. The comment-input-field must contain text. |

| **U07** | Login With OrchID |
|---|---|
| **Actors** | Extension, User, OrchID-OAuth |
| **Flow** | If a user is not logged in with an OrchID account the extension provides a login button. When clicking on that button the OrchID login form is displayed. The user is provided with information about what information is queryed from OrchID (and asked for consent if that information is personal information). On login a public/private-keypair which is password protected is generated and saved. The user is promted to choose a password for the keypair. |
| **Preconditions** | The user needs to have an OrchID account. |

| **U08** | Logout |
|---|---|
| **Actors** | Extension, User |
| **Flow** | The user can logout of the extension. On logout all personal information (OAuth-Token, Keys, Certificate, Cache, ... ) is deleted from the extension.  |
| **Preconditions** | The user needs to be logged in with an OrchID-account. |

| **U09** | Comment Overview |
|---|---|
| **Actors** | Extension, User, DB |
| **Flow** | The user can open a view that displays all comments written by him. For GDPR compliance the view also provides the options to download all comments made by the user and account-information as a JSON-file and to delete an individual comment. |
| **Preconditions** | The user needs to be logged in with an OrchID-account. |

| **U10** | Deleting Comments |
|---|---|
| **Actors** | Extension, User, DB |
| **Flow** | The user can delete comments that he created himself. When a comment is deleted the comments text and author are removed from the database-record and a state-value is set to "deleted". In the comment-history of the commented document a place-holder stays in place to indicate that a comment was deleted. |
| **Preconditions** | The user needs to be logged in with an OrchID-account. |

