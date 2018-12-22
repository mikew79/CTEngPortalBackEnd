var mongoose = require('mongoose');

//MonogDB Group Schema
var groupSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    permissions: Number
});

groupSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Groups',groupSchema);