import { writable, Writable } from "svelte/store";

export const emptyDraft: IDraft = { id: Date.now(), date: new Date(), url: "url", text: "" };
export const emptyComment: IComment = { id: Date.now(), date: new Date(), author: { id: -1, name: "" }, url: "url", text: "", signature: "" };

export const currentComment: Writable<IComment> = writable<IComment>(emptyComment);
export const currentDraft: Writable<IDraft> = writable<IDraft>(emptyDraft);

export const allDrafts: Writable<IDraft[]> = writable<IDraft[]>([]);
