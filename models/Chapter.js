const { ObjectId, Int32 } = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chapter = new Schema({
    name: { type: String, default:''}, 
    lesson:[{type:mongoose.Schema.Types.ObjectId, ref:'Lesson'}],
    createAt:{type: Date, default: Date.now},
    updateAt:{type: Date, default: Date.now},
});

module.exports = mongoose.model('Chapter', chapter);