const mongoose = require("mongoose");

class Database {
    constructor() {
        this._connect();
    }

    _connect() {
        // mongoose.connect('mongodb://localhost:27017/testing-db', {
        mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, (err) => {
            if (err) {
                console.error('CONNECTION ERROR');
            } else {
                console.log('CONNECTION SUCCESFULLY');
            }
        });
    }
}


module.exports = new Database();