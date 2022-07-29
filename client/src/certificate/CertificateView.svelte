<script lang="ts">
  import { db } from "../db";

  import * as cert from "./handler";
  import * as pvutils from "pvutils";

  export let hasCertificate: boolean = false;

  let orcid;
  let name;

  if(chrome.storage.session) {
    chrome.storage.session.get("userData").then(result => {
      if (result !== null) {
        console.log(result);

        let data = result.userData;
        console.log(data);

        // Extract raw orcid from the returned URL
        orcid = data.orcidId;
        name = data.orcidGivenName + " " + data.orcidFamilyName;

        (document.getElementById("orcid") as HTMLSpanElement).innerText = orcid;
        (document.getElementById("name") as HTMLInputElement).value = name;
      }
    });
  }

  async function requestCertificate() {
    const name = (document.getElementById("name") as HTMLInputElement).value;
    const email = (document.getElementById("email") as HTMLInputElement).value;

    const keyPair = await cert.generateKeyPair();
    const csr = await cert.generateCSR(keyPair, orcid, name, email);
    const csrBuffer = csr.toSchema().toBER(false);
    const csrString = pvutils.arrayBufferToString(csrBuffer);
    const csrBase64 = pvutils.toBase64(csrString);

    let res = await fetch("http://localhost:3000/users/add", {
      headers: { "Content-Type": "application/json" },
      method: "POST",

      body: JSON.stringify({
        orcid: orcid,
        name: name,
        email: email,
        csr: csrBase64,
      }),
    });

    if (res.status != 200) {
      let message = await res.text();
      console.log(res.status + " " + message);
      // TODO: notify end user in some way
      return;
    }

    let data = await res.json();

    await db.open();
    await db.storeCertificate(data.id, keyPair.privateKey, data.cert, data.root);

    hasCertificate = true;
  }
</script>

<div class="cert-request">
  <form>
    <p>Logged in with ORCiD: <span id="orcid"></span></p>

    <div class="form-group">
      <label for="name">Name (from ORCiD)</label>
      <input
        type="text"
        class="form-control"
        id="name"
        readonly
      />
    </div>

    <br />
    <p>Now you can specify optional data that will be stored inside the certificate. If you don't want to give any more details, just leave the fields blank.</p>

    <div class="form-group">
      <label for="email">E-Mail</label>
      <input
        type="text"
        class="form-control"
        id="email"
        placeholder="john.doe@example.com"
      />
    </div>

    <br />
    <button
      title="Requests a certificate."
      type="button"
      class="btn cert-button"
      on:click={requestCertificate}>Get your certificate</button
    >
  </form>
</div>

<style>
  .cert-request {
    padding: 10px;
  }

  .form-group {
    margin-bottom: 10px;
  }

  .cert-button {
    background-color: white;
    color: black !important;
    border-color: rgb(201, 201, 201) !important;
    text-transform: none !important;
  }
  .btn:hover {
    background-color: lightgrey;
  }
</style>
