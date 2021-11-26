import {
    refresh_tokens, get_currently_playing, queue_song, get_id_from_uri, uri_from_id
} from "./utils.js";


export default async function scan_and_update(cached_users) {

    for (const user of cached_users) {
        //console.log(user.last_refresh);
        let token = user.spotify_token;

        // if first initilization(no last refresh) or token has expired
        if (!user.last_refresh || Date.now() - user.last_refresh > 3599 * 1000) { // 3600 is when the token expires
            console.log("Refreshing token for", user.spotify_id);
            token = await refresh_tokens(user.refresh_token);
            user.last_refresh = Date.now();
            user.spotify_token = token;
        }
        //console.log("id", user.spotify_id, "token:", token);

        try {
            const [song_id, song_length] = await get_currently_playing(token);

            if (song_id) {
                for (const link of user.links) {
                    // if it's a root and past grace time, queue the song
                    if (link.root === get_id_from_uri(song_id)) {
                        if (link.timeout && Date.now() > link.timeout || !link.timeout) {
                            console.log("Queueing Song! ", song_id)
                            queue_song(uri_from_id(link.link), token);
    
                            // set some "gracetime" after it queues so it doesn't infinitely queue
                            const gracetime = song_length + 10000; 
    
                            link.timeout = Date.now() + gracetime;
                        }
                        
                        
                    }
                }
            }
        } catch (error) {

        }

    }
}

