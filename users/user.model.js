const mongoose = require('mongoose');

//MongoDB UserSchema
const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        firstName: String,
        lastName: String
    },
    email: String,
    password: String,
    profilePicture: Buffer,
    gid: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Groups'
    }
});
userSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User',userSchema);