<script lang="ts">
    import { currentComment, emptyComment } from "../utils/stores";
    import { formatDate } from "../utils/utils"; 
    import VerificationStatusIcon from "../utils/VerificationStatusIcon.svelte";

    let comment: IComment = emptyComment;
    currentComment.subscribe(value => comment = value);

    function exitViewHandler(): void {
        window.top.close();
    }

    $: text = comment.text !== "" ? comment.text : "no comment found";
</script>

{#if comment !== emptyComment}
    <div class="bar-container">
        <!-- <button type="button" class="btn flex-item flex-btn" on:click={exitViewHandler}>
            <i class="material-icons clear-icon">clear</i>
        </button> -->
        <p class="author flex-item">{comment.author.name} </p> 
        <p class="date flex-item">{formatDate(comment.date)} </p>
    </div>
    <div class="comment">{text}</div>
{:else}
    <VerificationStatusIcon status="loading"></VerificationStatusIcon>
{/if}

<style>
    .bar-container {
        display: flex;
        align-items: center;
        background-color: rgb(240, 240, 240);
        
        padding: 2px;
    }

    .comment {
        border: 1px solid rgb(108, 108, 108);
        border-radius: 2px;

        padding: 10px;
        margin: 2px;
    }

    .date {
        margin-left: auto !important;
        margin-right: 30px !important;
    }

    .flex-item {
        margin: 0;
        margin-left: 8px;
        margin-right: 8px;

        padding: 2px;
    }
</style>
