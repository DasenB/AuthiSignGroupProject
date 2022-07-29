<script lang="ts">
  import * as draftController from "../controller/draftController";
  import { addCommentFromDraft } from "../controller/commentController";

  import { confirmDeleteDraft, confirmSubmitDraft } from "../utils/alerts";
  import { currentDraft } from "../utils/stores";

  import { fly, fade } from "svelte/transition";
  import HttpsUrlInput from "./HttpsUrlInput.svelte";
  import { addUnloadListener, removeUnloadListener } from "./unloadHandler";

  let showNotification: boolean = false;
  let isSaveNotification: boolean = true;
  let notificationTimeout;

  let canSaveAndSubmit: boolean = true;

  let draft: IDraft = undefined;
  currentDraft.subscribe((value) => (draft = value));

  function handleVisitUrl(): void {
    if (draft.url !== undefined && draft.url !== "") {
      chrome.tabs.create({
        url: draft.url,
        active: true,
      });
    }
  };

  async function handleSaveDraft(): Promise<void> {
    try {
      draftController.updateDraftFromDraft(draft);
    } catch (err) {
      console.log(err.message);
    }

    showSuccessNotification(true);
    removeUnloadListener();
  };

  function handleDeleteDraft(): void {
    if (confirmDeleteDraft()) {
      draftController.deleteDraft(draft.id);
      window.top.close();
    }
  }

  async function handleSubmitDraft(): Promise<void> {
    if (!confirmSubmitDraft()) {
      return;
    }
    
    if (await draftController.getDraft(draft.id)) {
      canSaveAndSubmit = false;
      let id: number = await addCommentFromDraft(draft);

      if (id) {
        showSuccessNotification(false);
        draftController.deleteDraft(draft.id);
        removeUnloadListener();
      } else {
        canSaveAndSubmit = true;
      }
    } else {
      canSaveAndSubmit = true;
      // TODO: notify user that submit did not work
    }
    // TODO: change to reader view with success notification (or after alert)
  }

  function showSuccessNotification(
    showSaveNotification: boolean,
    duration: number = 1500
  ): void {
    isSaveNotification = showSaveNotification;

    // clear previous timeouts and close previous notifications
    if (showNotification) {
      clearTimeout(notificationTimeout);
      showNotification = false;
      setTimeout(() => (showNotification = true), 200);
      duration += 200;
    } else {
      showNotification = true;
    }

    notificationTimeout = setTimeout(() => {
      showNotification = false;
    }, duration);
  }
</script>

<div class="url-container">
  <div class="url-subcontainer">
    {#if showNotification}
      <div
        in:fly
        out:fade
        class="alert alert-warning alert-dismissible success-notification container-element"
        role="alert"
      >
        <strong>{isSaveNotification ? "Draft saved" : "Draft submitted. Tab can be closed"}</strong
        >.
        <button
          type="button"
          class="btn right-bound"
          on:click={() => (showNotification = false)}
        >
          <i class="material-icons">close</i>
        </button>
      </div>
    {/if}

    <button
      title="Open specified website in new tab."
      type="button"
      class="btn container-element"
      on:click={handleVisitUrl}
    >
      <i class="material-icons visit-icon">open_in_new</i>
    </button>
    <HttpsUrlInput
      placeholder="Enter url to submit review to"
      bind:url={draft.url}
    />
  </div>
</div>

<div class="input-group">
  <textarea
    placeholder="Enter comment..."
    class="form-control"
    on:change={addUnloadListener}
    bind:value={draft.text}
  />
</div>

<div class="btn-group container-element">
  <button
    title="Submit and publish the comment to the specified website."
    type="button"
    class="btn"
    disabled={!canSaveAndSubmit}
    on:click={handleSubmitDraft}
  >
    <i class="material-icons done-icon">send</i>
  </button>
  <button
    title="Save the draft."
    type="button"
    class="btn"
    disabled={!canSaveAndSubmit}
    on:click={handleSaveDraft}
  >
    <i class="material-icons save-icon">save</i>
  </button>
  <button
    title="Permanently delete the draft. Cannot be reverted."
    type="button"
    class="btn"
    disabled={!canSaveAndSubmit}
    on:click={handleDeleteDraft}
  >
    <i class="material-icons clear-icon">delete</i>
  </button>
</div>

<style>
  .right-bound {
    float: right;
  }

  .success-notification {
    position: absolute;

    display: flex;
    align-items: center;
    justify-content: space-between;

    min-width: 10cm;
    min-height: 1.3cm;

    z-index: 2;
  }

  .url-container {
    display: table;
    padding: 5px;
  }

  .url-subcontainer {
    /* border: 1px solid black; */
    display: table-row;
  }

  .container-element {
    display: table-cell;
  }

  .clear-icon {
    color: rgb(215, 77, 77);
  }

  .save-icon {
    color: rgb(86, 86, 86);
  }

  .done-icon {
    color: rgb(61, 165, 61);
  }
</style>
