import {
    refresh_tokens, get_currently_playing, queue_song, get_id_from_uri, uri_from_id
} from "./utils.js";

import mongoose from 'mongoose';
import { user_model } from './link_schema.js';



export default async function scan_and_update(cached_users) {

    for (const user of cached_users) {
        //console.log(user.last_refresh);
        let token = user.token;
        let _id = user._id;

        if (Date.now() - user.last_refresh > 3599 * 1000 || !user.last_refresh) { // 3600 is when the token expires
            console.log("Refreshing token for", user.spotify_id);
            token = await refresh_tokens(user.refresh_token);

            user.last_refresh = Date.now();
            user.token = token;
            await user.save();
        }
        //console.log("id", user.spotify_id, "token:", token);

        try {
            const [song_id, song_length] = await get_currently_playing(token, user.refresh_token);

            if (song_id) {
                for (const link of user.links) {
                    let link_id = link._id;
                    // if it's a root and past grace time, queue the song
                    if (link.root === get_id_from_uri(song_id)) {
                        // console.log(Date.now(), link.timeout);
                        if (Date.now() > link.timeout || !link.timeout) {
                            console.log("Queueing Song! ", song_id)
                            queue_song(uri_from_id(link.link), token);

                            // set some "gracetime" after it queues so it doesn't infinitely queue
                            const gracetime = song_length + 10000;

                            console.log("gracelength", gracetime);
                            
                            await user_model.findOneAndUpdate(
                                {"_id": _id, "links._id": link_id},
                                {"$set": {
                                    "links.$.timeout" : Date.now() + gracetime}
                                }
                            );
                            //console.log(await user.save());
                        }


                    }
                }
            }
        } catch (error) {
            console.log(error);
        }

    }
}

const uri = `mongodb+srv://nathanlee:${process.env.MONGO_PASSWORD}@cluster0.ej9q5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`


async function init() {
    await mongoose.connect(uri);

    setInterval(async () => {
        scan_and_update(await user_model.find());
    }, 10000)
}


init();