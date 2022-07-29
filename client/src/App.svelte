<script lang="ts">
  import LoginView from "./login/LoginView.svelte";
  import CertificateView from "./certificate/CertificateView.svelte";
  import DashboardView from "./dashboard/DashboardView.svelte";
  import EditorView from "./editor/EditorView.svelte";
  import ReaderView from "./reader/ReaderView.svelte";
  import { db } from "./db";
  import { currentComment, currentDraft } from "./utils/stores";
  import {
    deserializeComment,
    deserializeDate,
    deserializeDraft,
    formatDate,
  } from "./utils/utils";
  import { get_slot_changes } from "svelte/internal";
  import createTab from "./utils/tabCreator";

  let loggedIn: boolean = false;
  let hasCertificate: boolean = false;

  let editorEnabled: boolean = false;
  let readerEnabled: boolean = false;

  async function certQuery(): Promise<boolean> {
    const res = await db.keyCert.toArray();

    if (res.length === 0) {
      return false;
    } else {
      return true;
    }
  }

  // set loggedIn and hasCertificate
  chrome.storage.session.get(["loggedIn", "hasCertificate"], function (result) {
    if (result.loggedIn !== undefined) {
      loggedIn = true;
    }
    if (result.hasCertificate !== undefined) {
      hasCertificate = true;
    } else {
      certQuery().then((res) => (hasCertificate = res));
    }
  });

  // do something with the current user data (right after login, but also later)
  async function handleLoginCompleted(userData) {
      //console.log(userData);
      if(userData.orcidId !== undefined && userData.orcidIdToken !== undefined) {
        chrome.storage.session.set({loggedIn: true});
        loggedIn = true;
      }
  }

  // fetch login data when extension is opened
  chrome.storage.session.get('userData').then(value => handleLoginCompleted(value.userData));

  // receive login data from background script
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === "session" &&
        changes !== undefined &&
        changes.userData !== undefined &&
        changes.userData.newValue !== undefined) {
      handleLoginCompleted(changes.userData.newValue);
    }
  });

  var urlParams = new URLSearchParams(window.location.search);
  if (
    urlParams.has("editor") &&
    urlParams.get("editor") === "true" &&
    urlParams.has("id")
  ) {
    editorEnabled = true; // switch view

    // read id from url param
    let id: number = parseInt(urlParams.get("id"));
    if (id !== NaN) {
      // read draft for id
      db.drafts
        .where("id")
        .equals(id)
        .toArray()
        .then((drafts) => {
          if (drafts.length === 1) {
            currentDraft.set(drafts[0]);
          } else {
            // error handling
            if (drafts.length === 0) {
              console.log("no drafts for this id found");
            } else if (drafts.length > 1) {
              console.log("too many drafts with this id found");
            } else {
              console.log("error loading draft");
            }
          }
        });
    } else {
      // warn user
      console.log("Error: id cannot be parsed as a number");
    }
  } else if (urlParams.has("reader") && urlParams.get("reader") === "true") {
    chrome.runtime.sendMessage(
      { created: true, reader: true },
      function (response) {
        deserializeComment(response.comment);
        currentComment.set(response.comment);
      }
    );

    readerEnabled = true; // switch view
  }

  let dashboardViewModule;

  function handleInfo() {
    createTab("info.html", "", {});
  }
  
  const handleLogout = async () => {
    await db.delete().then(() => {
      loggedIn = false;
      hasCertificate = false;
      chrome.storage.session.clear();
    });
  };
</script>

<header>
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/icon?family=Material+Icons"
  />

  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined"
  />

  <link rel="stylesheet" href="vendor/bootstrap/css/bootstrap.min.css" />
  <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>

  <link
    href="vendor/orcid-auth-widget/orcid-widget.css"
    type="text/css"
    rel="stylesheet"
  />

  <title>App</title>
</header>

{#if editorEnabled}
  <EditorView />
{:else if readerEnabled}
  <ReaderView />
{:else}
  <main class="extension-main">
    <nav class="navbar navbar-dark my-navbar" style="padding: 10px">
      <div style="display: inline">
        <p class="navbar-brand" style="margin-bottom: 0px; cursor: default; float: left; margin-right: 0px;">Authi-sign</p>
        <button
          title="See DSGVO Compliance and Impressum"
          type="button"
          class="nav-button-no-bg rounded-circle btn"
          on:click={handleInfo}
        >
          <i class="material-icons-outlined" style="font-size: 20px; color: white;">
            info
          </i>
        </button>
      </div>
      {#if loggedIn && hasCertificate}
        <div style="display: inline">
          <button
            title="Reload Comments"
            type="button"
            class="nav-button rounded-circle btn"
            style="float: left; margin-right: 10px"
            on:click={dashboardViewModule.reloadContent}
          >
            <i class="material-icons" style="font-size: 24px; color: white;">
              refresh
            </i>
          </button>
          <button
            title="Logout and return to login screen."
            type="button"
            class="nav-button rounded-circle btn"
            on:click={handleLogout}
          >
            <i class="material-icons" style="font-size: 24px; color: white;"
              >logout</i
            >
          </button>
        </div>
      {/if}
    </nav>

    {#if !loggedIn}
      <LoginView bind:loggedIn bind:hasCertificate />
    {:else if !hasCertificate}
      <CertificateView bind:hasCertificate />
    {:else}
      <DashboardView bind:this={dashboardViewModule} />
    {/if}
  </main>
{/if}

<style>
  .extension-main {
    position: relative;
    width: 12cm;
    height: 15cm;
  }

  .my-navbar {
    background-color: blueviolet;
    width: 100%;
  }

  .nav-button {
    right: 30px;

    height: 40px;
    width: 40px;

    display: flex;
    justify-content: center;
    align-items: center;

    background-color: rgb(93, 30, 187);
  }

  .nav-button-no-bg {
    right: 30px;
    margin-top: 3px;

    height: 37px;
    width: 37px;
    display: flex;
    justify-content: center;
    align-items: center;

    /* background-color: rgb(93, 30, 187); */
  }

  .nav-button:hover {
    background-color: rgb(61, 19, 158);
  }
</style>
