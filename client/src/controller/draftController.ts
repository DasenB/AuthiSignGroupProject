import type { Integer } from "asn1js";
import { db } from "../db";
import { deserializeDraft } from "../utils/utils";

export async function getDraft(id: number): Promise<IDraft> {
  return await db.drafts.get(id);
}

export async function listDrafts(): Promise<IDraft[]> {
  // TODO: maybe map deserializeDraft here 
  return await db.drafts.toArray();
}

// should create draft with given text and so on and return the id of the database object
// could alternatively return whole IDraft
export async function addDraft(draft: IDraft): Promise<number> {
  await db.drafts.add({
    id: draft.id,
    url: draft.url,
    date: draft.date,
    text: draft.text,
  });
  return draft.id;
}

export async function deleteDraft(id: number): Promise<void> {
  await db.drafts.delete(id);
}

export async function updateDraftFromDraft(draft: IDraft): Promise<void> {
  updateDraft(draft.id, draft.url, draft.text);
}

export async function updateDraft(id: number, url: string, text: string): Promise<void> {
  await db.drafts.update(id, {
    text: text,
    url: url,
    date: new Date(),
  });
}
