const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categories = new Schema({
    name: { type: String},
    parent: {type: String,default:null},
   course:[Schema.Types.ObjectId],
});

module.exports = mongoose.model('Category', categories);