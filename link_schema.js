import mongoose from 'mongoose';

const linkSchema = new mongoose.Schema({
    root: String,
    link: String,
    timeout: Number
});

const userSchema = new mongoose.Schema({
    spotify_id: String,
    token: String,
    refresh_token: String,
    user_details: Object,
    last_refresh: Number,
    links: [
        linkSchema
    ]
})
const mod = new mongoose.model('user_model', userSchema);

export { mod as user_model }