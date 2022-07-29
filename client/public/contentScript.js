
let interval = setInterval(() => {
    let userData = {
        orcidId: getOrcidId(),
        orcidGivenName: getOrcidGivenName(),
        orcidFamilyName: getOrcidFamilyName(),
        orcidIdToken: getOrcidIdToken(),
    }

    //console.log('user data: ', userData);
    if(userData.orcidId !== undefined &&
        userData.orcidIdToken !== undefined) {
        //console.log('sending message');
        chrome.runtime.sendMessage("mmkpdkaceejhpnlagpfgbehemjegmkod", {"userData": userData},
            function(response) {
                //console.log("Response received.");
                clearInterval(interval);
            });
    }
}, 100)

function getElementValue(elementId) {
    let orcidIdField = document.getElementById(elementId);
    if (!orcidIdField) return undefined;
    return document.getElementById(elementId).value;
}

function getOrcidId() {
    let value = getElementValue('orcidId');
    let orcidMatch = value.match(/((\d{4})-?){4}/);
    
    return orcidMatch[0];
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
