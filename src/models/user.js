const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    content: Object,
    first_name: String,
    last_name: String,
    profile_url: Object,
    email: {
        type: String,
        unique: true
    },
    password: String,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

const UserModel = mongoose.model('Users', userSchema);

module.exports = UserModel;