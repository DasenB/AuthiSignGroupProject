export function confirmDeleteDraft(): boolean {
    return confirm("Do you really want to delete this draft?");
}

export function confirmSubmitDraft(): boolean {
    return confirm("Do you really want to submit this comment and make it publically available?");
}