const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/passportapp');

const bcrypt = require('bcryptjs');

// UserSchema
const UserSchema = mongoose.Schema({
    name: {
        type: String
    },
    username: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
})

const User = module.exports = mongoose.model('User', UserSchema);

// Functions
module.exports.registerUser = function(newUser, callback){
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err){
                console.log(err);
            }
            newUser.password = hash;
            newUser.save(callback);
        })
    })
}

module.exports.findUserByUsername = function (uname, callback) {
    const query = {username: uname}
    User.findOne(query, callback)
}

module.exports.getUserById = function (id, callback) {
    User.findById(id, callback)
}

module.exports.comparePassword = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if (err) {
            throw err;
        }
        callback(null, isMatch)
    })
}