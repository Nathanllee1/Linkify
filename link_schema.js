import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    spotify_id: String,
    token: String,
    refresh_token: String,
    user_details: Object,
    links: [
        {
            root: String,
            link: String
        }
    ]
})
const mod =  new mongoose.model('user_model', userSchema);

export {mod as user_model}