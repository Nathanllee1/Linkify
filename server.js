import express from 'express';
import request from 'request';
import dotenv from 'dotenv'
import path from 'path';
import mongoose from 'mongoose';
import scan_and_update from './scan.js';
import { user_model } from './link_schema.js';
import { resolveSoa } from 'dns';

dotenv.config();

const uri = `mongodb+srv://nathanlee:${process.env.MONGO_PASSWORD}@cluster0.ej9q5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
const port = 5000;

let cached_users;

var spotify_client_id = process.env.SPOTIFY_CLIENT_ID;
var spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET;

var spotify_redirect_uri = "http://localhost:5000/auth/callback";

var generateRandomString = function (length) {
    var text = "";
    var possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

var app = express();

app.get("/auth/login", (req, res) => {
    console.log("HEY")
    var scope = "user-modify-playback-state user-read-email user-read-private user-read-currently-playing";
    var state = generateRandomString(16);

    var auth_query_parameters = new URLSearchParams({
        response_type: "code",
        client_id: spotify_client_id,
        scope: scope,
        redirect_uri: spotify_redirect_uri,
        state: state,
    });

    auth_query_parameters.toString();
    console.log("Redirecting", "https://accounts.spotify.com/authorize/?" +
        auth_query_parameters.toString())
    res.redirect(
        "https://accounts.spotify.com/authorize/?" +
        auth_query_parameters.toString()
    );
});

app.get("/auth/callback", (req, res) => {
    var code = req.query.code;

    var authOptions = {
        url: "https://accounts.spotify.com/api/token",
        form: {
            code: code,
            redirect_uri: spotify_redirect_uri,
            grant_type: "authorization_code",
        },
        headers: {
            Authorization: "Basic " +
                Buffer.from(spotify_client_id + ":" + spotify_client_secret).toString(
                    "base64"
                ),
            "Content-Type": "application/x-www-form-urlencoded",
        },
        json: true,
    };

    request.post(authOptions, async function (error, response, token_body) {
        if (response.statusCode === 200) {

            var options = {
                'method': 'GET',
                'url': 'https://api.spotify.com/v1/me',
                'headers': {
                    'Authorization': 'Bearer ' + token_body.access_token
                }
            };

            request(options, async function (error, response, user_body) {
                let parsed_resp = JSON.parse(user_body)
                let id = parsed_resp.id;
                let access_token = token_body.access_token;
                console.log("Processing", id);

                if ((await user_model.find({ spotify_id: id })).length == 0) { // if user doesn't exist
                    console.log("Registering", id);
                    const new_user = new user_model({
                        spotify_id: id,
                        token: access_token,
                        refresh_token: token_body.refresh_token,
                        user_details: parsed_resp
                    })

                    await new_user.save();
                }

                console.log("token", access_token, "id", id)
                res.redirect(`/?token=${access_token}&id=${id}`);
            });
        }

    });
});


app.get("/links", async (req, res) => {
    const id = req.query.id;

    console.log("Fetching links for", id);

    let links = await user_model.find({ spotify_id: id });
    //console.log({ "links": links[0].links })
    res.json({ "links": links[0].links });
})

app.post("/linksubmit", async (req, res) => {
    const root = req.query.root;
    const link = req.query.link;
    const id = req.query.id;

    if (link && root && id) {
        console.log(await user_model.findOneAndUpdate({ spotify_id: id }, {
            $push: { links: { root: root, link: link } }
        }));
    }
    
    res.status(200).send("Ok")

    cached_users = await user_model.find(); // update cache

})

app.delete("/link", async (req, res) => {
    const link_id = req.query.link_id;
    const user_id = req.query.user_id;
    console.log("Deleting", link_id, "for", user_id);

    console.log(await user_model.updateOne({spotify_id : user_id}, {$pull: { links: {_id : link_id}}}))

    res.status(200).send("Deleted");
})


app.listen(port, async() => {
    console.log(`Listening at http://localhost:${port}`);

    await mongoose.connect(uri);
    cached_users = await user_model.find();

    console.log(cached_users.length, "Users");

    // TODO, put in retry loop
    
    setInterval(() => {
        scan_and_update(cached_users);
    }, 5000)
});

app.use(express.static('Linkify/public'));