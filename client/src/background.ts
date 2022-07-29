import * as commentController from "./controller/commentController";

chrome.runtime.onInstalled.addListener((details) => {
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if(changeInfo.status != "complete") {
        return;
    }

    if(tab.url.startsWith("http://") || tab.url.startsWith("https://")) {
        console.log("Fetching comments.");
        let comments = await commentController.listWebsiteComments(tab.url);

        if(!Array.isArray(comments)) {
            comments = [];
        }

        if(comments.length > 0) {
            chrome.action.setBadgeBackgroundColor({ tabId: tabId, color: [0, 255, 0, 255] });
            chrome.action.setBadgeText({ tabId: tabId, text: comments.length.toString() });
        }

        console.log("Fetched " + comments.length + " comments.");
        console.log(comments);
    }
});

// receive login data from content script on web page after orcid login
chrome.runtime.onMessage.addListener(
function(request, sender, sendResponse) {
    //console.log("Request received.");
    //console.log("Request: ", request, request.userData);
    chrome.storage.session.set({userData: request.userData});
    sendResponse({});
});

export {};
 
