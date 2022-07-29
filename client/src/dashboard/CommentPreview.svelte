<script lang="ts">
  import { formatDate } from "../utils/utils";

  export let text: string;
  export let isDraft: boolean;
  export let date: Date;
  export let author: string;
  export let url: string;
</script>

<div class="card comment">
  {#if isDraft}
    <div class="url-container">
      <p class="url">{url}</p>
    </div>
  {/if}
  <p class="comment-container">
    {text}
  </p>
  <div>
    {#if !isDraft}
      <p class="author meta-text">{author}</p>
      <p class="date meta-text">{formatDate(date)}</p>
    {:else}
      <p class="date meta-text">Last edited: {formatDate(date)}</p>
    {/if}
  </div>
</div>

<style>
  .url {
    color: rgb(73, 73, 233);

    margin: 0;
    margin-left: 8px;
    margin-right: 8px;
    margin-top: 3px;
    margin-bottom: 3px;
    padding: 2px;

    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
            line-clamp: 1; 
    -webkit-box-orient: vertical;
  }

  .url-container {
    border-bottom: 1px solid gray;
  }

  .comment-container {
    margin: 10px;
    padding: 0px;
    min-height: 35px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
            line-clamp: 3; 
    -webkit-box-orient: vertical;
  }
  .comment {
    background-color: rgba(98, 78, 121, 0.4);
    margin: 2px;
    border: none;
    cursor: pointer;
  }
  .comment:hover {
    background-color: rgba(98, 78, 121, 0.5);
  }

  .meta-text {
    display: inline-block;
    margin: 0;
    margin-left: 8px;
    margin-right: 8px;
    margin-bottom: 3px;

    padding: 2px;
  }
  .author {
    font-weight: bold;
    float: left;
  }
  .date {
    float: right;
    color: gray;
  }
</style>
