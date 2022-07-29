# Storage

## Things to store and where they will be stored

- Certificate:
  - os or IndexedDB
- user data (identity):
  - IndexedDB
- fingerprint to unlock:
  - IndexedDB
- unlock status:
  - inside extension / maybe as state in framework?

## How to store things inside of the extension

With Chrome one can use the chrome.storage API to store, retrieve and track changes to user data. It is possible to use the chrome.storage.sync property to sync data between devices.
Since the data is not encrypted it is not save to store confidential data.

[Documentation](https://developer.chrome.com/docs/extensions/reference/storage/# "Documentation")

#### Uses of chrome.storage for our application:

- temporary data (chrome.storage.session):
  - states (unlock status)
  - orcidID token?

## IndexedDB

Is an asynchronous database based on JSON-objects inside of the Browser.

For better usability we will either use [IndexedDB Promised](https://github.com/jakearchibald/idb "IndexedDB Promised") or [localForage](https://github.com/localForage/localForage "localForage")
