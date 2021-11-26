<script>
    import SongDisplay from "./SongDisplay.svelte"
    let typed_value;
    let selected = false;
    let results = [];

    export let selected_value;

    function select_item(id) {
        selected_value = id;
        selected = true;
    }

    async function search_spotify(query) {
        var myHeaders = new Headers();
        myHeaders.append(
            "Authorization",
            "Bearer " + localStorage.getItem("spotify_token")
        );

        var requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
        };

        const res = await fetch(
            `https://api.spotify.com/v1/search?q=${query}&type=track`,
            requestOptions
        );

        results = (await res.json()).tracks.items;
        console.log(results);
    }

    function type_change() {
        search_spotify(typed_value);
    }
</script>

<div>
    {#if selected}
    <SongDisplay song_id={selected_value.id}/>
    <button on:click={() => {selected=false}}>Edit</button>
    {:else}
    <input bind:value={typed_value} on:input={type_change} placeholder="Search Spotify" />
    <div id="results">
        {#each results as result}
            <div class="result" on:click="{select_item(result)}">
                <b>{result.name} - </b>
                {#each result.artists as artist}
                    <span>{artist.name}</span>
                {/each}
            </div>
        {/each}
    </div>
    {/if}
    
</div>

<style>
    #results {
        overflow: auto;
        height: 100px;
        margin-bottom: 10px;
        width: 260px;

    }

    .result {
        margin-bottom: 2px;
    }
    .result:hover {
        background-color: rgb(139, 139, 255);
    }
</style>
