<script lang="ts">
  import { addUnloadListener } from "./unloadHandler";

  const httpsPrefix = "https://";
  const httpPrefix = "http://";

  export let placeholder: string = "";
  export let url: string = undefined;

  // displayUrl must equal url, leaving out the https prefix
  let displayUrl: string = "";
  $: if (url !== undefined) {
    if (url.startsWith(httpsPrefix)) {
      displayUrl = url.substring(httpsPrefix.length);
    } else if (url.startsWith(httpPrefix)) {
      displayUrl = url.substring(httpPrefix.length);
    } else {
      displayUrl = url;
    }
    displayUrl = displayUrl; // triggers the $ sign
  }

  // add https prefix / replace http prefix with https prefix after input change
  function handleUrlInput(event: Event & { currentTarget: EventTarget & HTMLInputElement; }): void {
    addUnloadListener();

    let inputUrl: string = event.currentTarget.value;

    if (inputUrl.startsWith(httpsPrefix)) {
      url = inputUrl;
    } else if (inputUrl.startsWith(httpPrefix)) {
      url = httpsPrefix + inputUrl.substring(httpPrefix.length);
    } else {
      url = httpsPrefix + inputUrl;
    }
    displayUrl = url; // change displayUrl so the update form url's value will definitely update the ui
  }
</script>

<div class="url-container">
  <div class="url-subcontainer">
    <p class="element prefix">https://</p>
    <input
        class="form element no-left-border"
        style="width: 10cm"
        placeholder={placeholder}
        value={displayUrl}
        on:change={handleUrlInput}
    />
  </div>
</div>

<style>
  .url-container {
    display: table-cell;
    cursor: default;
  }

  .url-subcontainer {
    display: table-row;
    border: 1px solid #ccc;
    border-radius: 2px;
  }

  .element {
    display: table-cell;
  }

  .prefix {
    border: 1px solid #ccc;
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;
    background-color: #eee;
    padding-left: 5px;
    padding-right: 5px;
  }
  
  .no-left-border {
    border-left: 0px;
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
  }
</style>
