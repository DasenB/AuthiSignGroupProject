<script lang="ts">
  import CommentPreview from "./CommentPreview.svelte";
  import { allDrafts, currentDraft } from "./../utils/stores";
  import { db } from "../db";
  import { createDraftTab } from "../utils/tabCreator";
  import { confirmDeleteDraft } from "../utils/alerts";
import { deleteDraft, listDrafts } from "../controller/draftController";

  export let draft: IDraft;

  async function handleDeleteDraft() {
    if (confirmDeleteDraft()) {
      try {
        //update db
        await deleteDraft(draft.id);
        allDrafts.set(await listDrafts());
      } catch (err) {
        console.log(err.message);
      }
    }
  };

  function handleDraftClick(): void {
    createDraftTab(draft.id);
  };
</script>

<div class="draft-container">
  <div title="Click to edit draft." on:click={handleDraftClick}>
    <CommentPreview
      isDraft={true}
      text={draft.text}
      date={draft.date}
      author=""
      url={draft.url}
    />
  </div>
  <button
    title="Permanently delete the draft. Cannot be reverted."
    type="button"
    class="btn"
    on:click={handleDeleteDraft}
  >
    <i class="material-icons clear-icon">delete</i>
  </button>
</div>

<style>
  .draft-container {
    display: grid;
    grid-template-columns: 85% 15%;
  }

  .clear-icon {
    color: rgb(248, 88, 88);
    grid-row: span 1;
  }
</style>
