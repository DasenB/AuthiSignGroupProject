<script lang="ts">
  import { onMount } from "svelte";

  import { allDrafts } from "../utils/stores";
  import { getCurrentTab, getCurrentUserOrcid } from "../utils/utils";
  import { TabNames } from "./TabNames";
  import { createDraftTab } from "../utils/tabCreator";

  import Comment from "./Comment.svelte";
  import Draft from "./Draft.svelte";
  import VerificationStatusIcon from "../utils/VerificationStatusIcon.svelte";
  import { listUserComments, listWebsiteComments, verifyComment } from "../controller/commentController";
  import { addDraft, listDrafts } from "../controller/draftController";
  
  let tabs: TabNames[] = Object.values(TabNames);
  let activeTab: string = TabNames.SiteComments;
  let loadingSiteComments: boolean = false;
  let loadingUserComments: boolean = false;

  let siteComments: IComment[] = [];
  let userComments: IComment[] = [];
  let drafts: IDraft[] = [];

  onMount(reloadContent);
  allDrafts.subscribe(value => drafts = value);

  export async function reloadContent(): Promise<void> {
    const dbDrafts: IDraft[] = await listDrafts();
    allDrafts.set(dbDrafts ? dbDrafts : []);
    await reloadSiteComments();
    await reloadUserComments();
  }

  async function reloadSiteComments(): Promise<void> {
    loadingSiteComments = true;
    getCurrentTab()
      .then(tab => listWebsiteComments(tab.url))
      .then(comments => {
        loadingSiteComments = false;
        siteComments = comments ? comments : [];

        siteComments.forEach(async (c) => {
          console.log(await verifyComment(c));
        });
      });
  }

  async function reloadUserComments(): Promise<void> {
    loadingUserComments = true;
    getCurrentUserOrcid()
      .then(listUserComments)
      .then(comments => {
        loadingUserComments = false;
        userComments = comments ? comments : [];
      });
  }
  
  async function handleAddComment(): Promise<void> {
    let newDraft: IDraft = await createNewDraft();
    await addDraft(newDraft);
    createDraftTab(newDraft.id);
  };

  async function createNewDraft(): Promise<IDraft> {
    let url = "";

    // try to get the url from the active tab in the current window
    let tabs = await chrome.tabs.query({active: true, currentWindow: true});
    if (tabs !== undefined 
        && tabs.length == 1 
        && tabs[0] !== undefined 
        && tabs[0].url !== undefined
        && tabs[0].url.startsWith("http")) {
      url = tabs[0].url;
    }

    return {id: Date.now(), text:"", date: new Date(), url};
  }
</script>


<div>
  <ul class="nav nav-tabs">
    {#each tabs as tab}
      <li class="nav-item" style="width:33%; text-align: center; cursor: pointer;">
        <!-- TODO: make hover and current tab visible -->
        <p
          title={activeTab === tab ? "" : "Click to change tab."}
          class="nav-link {activeTab === tab ? 'active active-tab' : ''}"
          on:click={() => activeTab = tab}
          aria-current="page"
          >{tab}
        </p>
      </li>
    {/each}
  </ul>

  {#if activeTab === TabNames.SiteComments}
    <div class="page-container">
      {#if loadingSiteComments}
        <div class="center-container">
          <VerificationStatusIcon status="loading"/>
        </div>
      {:else if siteComments.length === 0}
        <div class="center-container">
          <div class="info-text">No comments found</div>
        </div>
      {:else}
        {#each siteComments as comment}
          <Comment comment={comment}/>
        {/each}
      {/if}
    </div>
  {:else if activeTab === TabNames.UserComments}
    <div class="page-container">
      {#if loadingUserComments}
        <div class="center-container">
          <VerificationStatusIcon status="loading"/>
        </div>
      {:else if userComments.length === 0}
        <div class="center-container">
          <div class="info-text">No comments found</div>
        </div>
      {:else}
        {#each userComments as comment}
          <Comment comment={comment}/>
        {/each}
      {/if}
    </div>
  {:else if activeTab === TabNames.Drafts}
    <div>
      {#each drafts as draft}
        <Draft draft={draft}/>
      {/each}
    </div>
  {/if}

  <button
    title="Create new comment draft. A new tab will be opened with an editor."
    type="button"
    class="float-button rounded-circle btn"
    on:click={handleAddComment}
  >
    <i class="material-icons" style="font-size: 48px;">add</i>
  </button>
</div>

<style>
  .page-container {
    height: 10cm;
  }

  .float-button {
    position: fixed;
    bottom: 20px;
    right: 20px;

    height: 60px;
    width: 60px;

    display: flex;
    justify-content: center;
    align-items: center;

    border-color: black;
    background-color: rgb(238, 238, 238);
  }

  .active-tab {
    background-color: rgb(238, 238, 238) !important;
  }

  .center-container {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0px;
    margin: 0px;
  }

  .info-text {
    color: gray;
    padding: 0px;
    margin: 0px;
  }

  .float-button:hover {
    background-color: rgb(206, 206, 206);
  }
</style>
