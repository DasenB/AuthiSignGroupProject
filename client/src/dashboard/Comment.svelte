<script lang="ts">
  import CommentPreview from "./CommentPreview.svelte";
  import { currentComment } from "./../utils/stores";
  import { createCommentTab } from "../utils/tabCreator";

  export let comment: IComment;

  function handleCommentClick(): void {
    createCommentTab(comment);
  }
</script>

<div title="Click to read full comment." on:click={handleCommentClick}>
  <CommentPreview
    isDraft={false}
    text={comment.text}
    author={comment.author.name}
    date={comment.date}
    url={comment.url}
  />
</div>
