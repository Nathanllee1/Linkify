<script>
    import SongDisplay from "./SongDisplay.svelte"
    export let root;
    export let link;

    export let id;

    let deleted = false;

    const delete_link = async () => {
        await fetch(BACKEND_URL + "/link?link_id=" + id +"&user_id=" + localStorage.getItem("id"), {method: 'DELETE'});
        deleted = true;
    }

    let enabled = true;
</script>

<div class="link_container" style="opacity:{enabled ? '100%' : '30%'}; display:{deleted ? 'None' : 'block'}">
    <div id="link_content">
        <SongDisplay song_id={root}/>
        <h1>🔗</h1>
        <SongDisplay song_id={link}/>
    </div>
    <!--
    <div id="configure_container" on:click={() => {enabled = !enabled}}>
        <input type="checkbox" bind:checked={enabled} />
        <h4>{enabled ? "Enabled" : "Disabled"}</h4>
    </div>
    -->
    <br>
    <div style="text-align:right">
        <button style="color:red" on:click={delete_link}>Delete</button>
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
