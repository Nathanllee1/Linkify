import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();
let spotify_client_id = process.env.SPOTIFY_CLIENT_ID;
let spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET;

async function refresh_tokens(refresh_token) {
    const params = new URLSearchParams();
    params.set("grant_type", "refresh_token");
    params.set("refresh_token", refresh_token);

    const res = await fetch("https://accounts.spotify.com/api/token",
        {
            method: 'POST',
            body: params,
            headers: {
                'Authorization': "Basic " + (Buffer.from(spotify_client_id + ":" + spotify_client_secret).toString('base64'))
            }
        }
    )

    if (!res.ok) {
        console.log(`An error has occured: ${res.status}`);
    }

    const token = (await res.json()).access_token;

    return (token);
}

async function get_currently_playing(token) {
    let requestOptions = {
        method: 'GET',
        headers: {
            "Authorization": "Bearer " + token
        },
        redirect: 'follow'
    };

    const res = await fetch("https://api.spotify.com/v1/me/player/currently-playing", requestOptions);

    if (!res.ok) {
        console.log(`An error has occured: ${res.status}`);
        console.log(await res.json())

        throw `${res.json.message}`
    }

    if (res.status == 204) // empty
        return (null)

    const json = await res.json() 

    

    return [json.item.uri, json.item.duration_ms];
}

async function queue_song(song, token) {
    let requestOptions = {
        method: 'POST',
        headers: {
            "Authorization": "Bearer " + token
        },
        redirect: 'follow'
    }

    const res = await fetch("https://api.spotify.com/v1/me/player/queue?uri=" + encodeURI(song), requestOptions);
}

function get_id_from_uri(uri) {
    return (uri.split(":")[2])
}

function uri_from_id(id) {
    return (`spotify:track:${id}`);
}

export {
    refresh_tokens, get_currently_playing, queue_song, get_id_from_uri, uri_from_id
}