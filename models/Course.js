const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Course = new Schema({
    name: { type: String, default:''},
    description: {type: String},
    image:{type: String, maxlength: 255},
    createAt:{type: Date, default: Date.now},
    updateAt:{type: Date, default: Date.now},
});

module.exports = mongoose.model('Course', Course);