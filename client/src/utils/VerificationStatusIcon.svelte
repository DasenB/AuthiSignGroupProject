<script lang="ts">
    import { Circle } from "svelte-loading-spinners";

    enum StatusNames {
        Verified = "done",
        Unknown = "question_mark",
        Rejected = "close",
        Loading = "loading",
    }

    export let status: string = StatusNames.Loading;
</script>

<div>
    {#if status === StatusNames.Verified}
        <i class="material-icons verification-icon verified">{StatusNames.Verified}</i>
    {:else if status === StatusNames.Unknown}
        <i class="material-icons verification-icon unknown">{StatusNames.Unknown}</i>
    {:else if status === StatusNames.Rejected}
        <i class="material-icons verification-icon rejected">{StatusNames.Rejected}</i>
    {:else if status === StatusNames.Loading}
        <Circle size="30" color="#AAAAAA" unit="px" />
    {/if}
</div>

<style>
    .verification-icon {
        size: 100px !important;
    }
    .verified {
        color: green;
    }
    .unknown {
        color: black;
    }
    .rejected {
        color: red;
    }
</style>
