<script lang="ts">
  import { db } from "../db";
  import { createLoginTab } from "../utils/tabCreator";

  export let loggedIn: boolean = false;
  export let hasCertificate: boolean = false;

  function storeLoginFlag(): void {
    chrome.storage.session.set({loggedIn: true});
    loggedIn = true;
  }

  function storeCertificateFlag(): void {
    chrome.storage.session.set({hasCertificate: true});
    hasCertificate = true;
  }

  async function startLogin() {
    // Delete old database stuff if needed
    if(db.isOpen()) {
      await db.delete().then(() => {
        loggedIn = false;
        hasCertificate = false;
        chrome.storage.session.clear();
      });
    }

    createLoginTab();
  }
</script>

<div class="login" id="login-div">
  <!-- <iframe src="sandbox.html" sandbox="allow-same-origin allow-scripts"/> -->
  <!-- <script src="vendor/orcid-auth-widget/orcid-widget.js"></script>
  <div id="orcidWidget" data-clientid='APP-Z4UU4QS1O08TM6G7' data-env="sandbox" data-redirecturi='http://127.0.0.1:8080'></div> -->
  <button
    title="Login using an ORCID iD."
    type="button"
    class="btn login-button"
    on:click={startLogin}>Connect your ORCID iD</button
  >
  <!-- <button
    title="Skip login. Used for debug purposes only."
    type="button"
    class="btn login-button"
    on:click={storeLoginFlag}>Debug: Skip login</button
  >
  <button
    title="Skip login and certificate creation. Used for debug purposes only."
    type="button"
    class="btn login-button"
    on:click={() => {storeCertificateFlag(); storeLoginFlag()}}>Debug: Skip login and certificate</button
  > -->
</div>

<style>
  .login {
    width: 100%;
    height: 100%;
    margin: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .login-button {
    background-color: white;
    color: black !important;
    border-color: rgb(201, 201, 201) !important;
    text-transform: none !important;
  }
  .btn:hover {
    background-color: lightgrey;
  }
</style>
