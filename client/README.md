# Running the extension

## Install required packages

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

## Run the extension

Again make sure, you are in the `client` directory.
Then you can start the client in development mode with

```
npm run dev
```

### Load the extension:

1. Go to [chrome://extensions](chrome://extensions)
2. Enable **Developer Mode**
3. Click on **Load unpacked** and select `client/public`

![img](https://wd.imgix.net/image/BhuKGJaIeLNPW9ehns59NfwqKxF2/vOu7iPbaapkALed96rzN.png?auto=format&w=741)

To view the changes after editing the code, save your files and click on the refresh button on [chrome://extensions](chrome://extensions).

## Testing 

For the testing of the extension we are using [jest](https://jestjs.io/).  
To start the tests move into the `client` directory and then run 

```
npm run test
```