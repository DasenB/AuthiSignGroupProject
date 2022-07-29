import moment from "moment";

export function formatDate(date: Date): string {
  return moment(date).format("ddd MMM DD, HH:mm");
}

export function deserializeDate(date: Date | string | number): Date {
  return new Date(date);
}

export function deserializeDraft(draft: IDraft): void {
  draft.date = deserializeDate(draft.date);
}

export function deserializeComment(comment: IComment): void {
  comment.date = deserializeDate(comment.date);
}

export async function getCurrentTab(): Promise<chrome.tabs.Tab> {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

export async function getCurrentUserOrcid(): Promise<string> {
  return chrome.storage.session.get('userData').then(value => value.userData.orcidId);
} 
