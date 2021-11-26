<script>
    import SongDisplay from "./SongDisplay.svelte"
    export let root;
    export let link;

    let enabled = true;
</script>

<div class="link_container" style="opacity:{enabled ? '100%' : '30%'}">
    <div id="link_content">
        <SongDisplay song_id={root}/>
        <h1>🔗</h1>
        <SongDisplay song_id={link}/>
    </div>

    <div id="configure_container" on:click={() => {enabled = !enabled}}>
        <input type="checkbox" bind:checked={enabled} />
        <h4>{enabled ? "Enabled" : "Disabled"}</h4>
    </div>
</div>

<style>
    #link_content {
        display: flex;
        align-items: center;
        gap: 10px;
        justify-content: space-around;
    }

    #configure_container {
        display: flex;
        justify-content: flex-end;
        align-items: baseline;
        gap: 2px;

    }
</style>
