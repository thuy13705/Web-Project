const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Course = new Schema({
    name: { type: String, default:''},
    description: {type: String},
    price: {type: String},
    // image:{type:String,data:Buffer,contentType:String,}, 
    image:{type:String,require:true},
    video:{type:String,require:true},
    createAt:{type: Date, default: Date.now},
    updateAt:{type: Date, default: Date.now},
});

module.exports = mongoose.model('Course', Course);