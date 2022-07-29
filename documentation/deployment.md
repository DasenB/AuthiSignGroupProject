# Deployment guide

## Concerning oauth authentication

### Vendor directory

Both the vendor directory for the client (`client/public/vendor`) as well as the vendor directory for the authentication-page server (`authentication-page/vendor`) must contain a copy of the [orcid-auth-widget](https://github.com/ORCID/orcid-auth-widget) for the login process to work.

### Redirect URL for ORCID Website

The URL that is redirected to when the user logged in successfully on the orcid website needs to be specified. This is done in

a) `client/public/sandbox.html` in the `orcidWidget div`.  
b) changed in the Orcid OAuth account

### Orcid OAuth account

A development account needs to be created at the [orcid-sandbox-developer-tools](https://sandbox.orcid.org/developer-tools) page.
The currently logged in account can be registered for the public OAuth API on this page.
Afterwards this page shows a `Client ID` and allows a URL to be registered as the `redirect URI`.

The Client ID of this account as well as the redirect URI must then be specified in the `"orcidWidget" div` in `client/public/sandbox.html`.

For further information see README.md of [orcid-auth-widget](https://github.com/ORCID/orcid-auth-widget)

### Orcid development credentials

During development, the following sandbox account can be used for authentication.

- Mail: <authi-sign-lecture@mailinator.com>
- Passwort: Geq^Zo7&NfZ@La9
  - since this sandbox account is only used for development, showing the account credentials here is no problem
- Emails can be viewed here:
  - <https://rtfeed.mailinator.com/v4/public/inboxes.jsp?to=authi-sign-lecture>
  - note that this email can be accessed by anyone who knows the email name `authi-sign-lecture`
