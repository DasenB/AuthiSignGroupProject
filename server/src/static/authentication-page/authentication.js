
function register() {
    let req = new XMLHttpRequest();
    req.open('get', 'https://localhost:8090');

    req.onload = function() {

        if (!("TextEncoder" in window)) 
            alert("Sorry, this browser does not support TextEncoder...");

        var options = JSON.parse(req.response)
        var enc = new TextEncoder();
        options.publicKey.challenge = enc.encode(options.publicKey.challenge);
        options.publicKey.rp = { name: 'localhost', id: 'localhost' }
        options.publicKey.user = {
            id: Uint8Array.from(
                "UZSL85T9AFC", c => c.charCodeAt(0)),
            name: "max@mustermann.de",
            displayName: "Max",
        }

        console.log(options);

        navigator.credentials.create(options)
                 .then(cred => console.log(cred));
    };

    req.send();
}

function getElementValue(elementId) {
    let orcidIdField = document.getElementById(elementId);
    if (!orcidIdField) return undefined;
    return document.getElementById(elementId).value;
}

function getOrcidId() {
    return getElementValue('orcidId');
}

function getOrcidGivenName() {
    return getElementValue('orcidGivenName');
}

function getOrcidFamilyName() {
    return getElementValue('orcidFamilyName');
}

function getOrcidIdToken() {
    return getElementValue('orcidIdToken');
}

//function getOrcidState() {
//    return getElementValue('orcidState');
//}

function showValue(elementId, value) {
    document.getElementById(elementId).innerHTML = value;
}

function handleClick() {
    showValue('orcidIdDemo', getOrcidId());
    showValue('orcidGivenNameDemo', getOrcidGivenName());
    showValue('orcidFamilyNameDemo', getOrcidFamilyName());
    showValue('orcidIdTokenDemo', getOrcidIdToken());
    //showValue('orcidStateDemo', getOrcidState());
}
