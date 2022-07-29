# Website

## Expected behaviour

- the website contains a auth button that redirects to the orcid authentification page
- after signing in using orcid **sandbox** credentials, our website opens up again and contains hidden input fields with the ids: `orcidId`, `orcidGivenName`, `orcidFamilyName` and `orcidIdToken`
  - note that signing in using real orcid credentials does not work
- A working example can be found here: https://orcid.github.io/orcid-auth-widget/widget.html

## Sandbox account

- Mail: <authi-sign-lecture@mailinator.com>
- Passwort: Geq^Zo7&NfZ@La9
  - since this sandbox account is only used for development, showing the account credentials here is no problem
- Emails can be viewed here:
  - <https://rtfeed.mailinator.com/v4/public/inboxes.jsp?to=authi-sign-lecture>
  - note that this email can be accessed by anyone who knows the email name "authi-sign-lecture"

## Setup

- install the orcid-auth-widget into the vendor directory
  - <https://github.com/ORCID/orcid-auth-widget>
- start a webserver from this directory

## Further Information

- see README.md in <https://github.com/ORCID/orcid-auth-widget>
