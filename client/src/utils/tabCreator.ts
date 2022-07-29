export default function createTab(
  path: string,
  queryString: string,
  content: object
) {
  let tabUrl: string = chrome.runtime.getURL(path + queryString);

  // todo check if sender is correct tab
  if (content !== undefined) {
    chrome.runtime.onMessage.addListener(function (
      request,
      sender,
      sendResponse
    ) {
      if(sender.url === tabUrl)
        sendResponse(content);
    });
  }

  chrome.tabs.create({
    url: tabUrl,
    active: false, // set to false to debug extension logs
    // TODO: when set to true causes errors for some people
    // when sending messages ("receiving end does not exist")
  });
}

export function createCommentTab(comment: IComment) {
  createTab("index.html", "?reader=true", { comment: comment });
}

export function createDraftTab(draftId: number) {
  createTab("index.html", "?editor=true&id=" + draftId, undefined);
}

export function createLoginTab() {
  createTab("sandbox.html", "", undefined);
}
