export function addUnloadListener(): void {
  addEventListener('beforeunload', beforeUnloadHandler);
}

export function removeUnloadListener(): void {
  removeEventListener('beforeunload', beforeUnloadHandler);
}

function beforeUnloadHandler(event: BeforeUnloadEvent): void {
  event.preventDefault();
  event.returnValue = ""; // setting returnValue activates the popup
}