<script>
    import { onMount } from "svelte";

    export let song_id;

    let song_details;

    onMount(async () => {
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

        const res = await fetch("https://api.spotify.com/v1/tracks/" + song_id, requestOptions);
        song_details = await res.json();

        console.log(song_details)
    });
</script>

{#if song_details}
<div id="song_container">
    <img src={song_details.album.images[0].url} alt={song_details.name} width="40%" height="40%" />
    <div id="text">
        <div><b>{song_details.name}</b></div>
        <div>{song_details.artists[0].name}</div>
    </div>
    
</div>
{/if}

<style>
    #song_container {
        display: flex;
        gap: 5px;
    }
</style>
