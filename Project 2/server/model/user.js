const mongoose = require('mongoose');

//DB Schema

//User Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name not Provided']
    },
    email: {
        type: String,
        unique: [true, 'email already exists'],
        required: [true, "email address not provided"],
        validate: {
            validator: function (value) {
                return /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(value);
            },
            message: '{VALUE} is not a valid email address'
        }
    },
    password: {
        type: String,
        required: [true, 'Provide a password']
    },
    city:[String]
})

module.exports = mongoose.model("User", userSchema);
