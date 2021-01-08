const { ObjectId, Int32 } = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Course = new Schema({
    name: { type: String, default:''},
    description: {type: String},
    price: {type: Number},
    // image:{type:String,data:Buffer,contentType:String,}, 
    image:{type:String,require:true},
    chapter:[{type:mongoose.Schema.Types.ObjectId, ref:'Chapter'}],
    category:{type:String,require:true},
    countBuy:{type:Number,default:0},
    countView:{type:Number,default:0},
    status:{type:Boolean,default:false},
    createAt:{type: Date, default: Date.now},
    updateAt:{type: Date, default: Date.now},
});

module.exports = mongoose.model('Course', Course);