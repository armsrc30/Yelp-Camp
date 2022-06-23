const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true

    }
})


UserSchema.plugin(passportLocalMongoose)//Adds username and password fields into schema, and makes sure they're unique

const User = mongoose.model('User', UserSchema);
module.exports = User;