const mongoose = require('mongoose');

const registerUser = new mongoose.Schema({
    content: Object,
    first_name: String,
    last_name: String,
    email: {
        type: String,
        unique: true
    },
    password: String
});

const RegisterUser = mongoose.model('Register', registerUser);

module.exports = RegisterUser;