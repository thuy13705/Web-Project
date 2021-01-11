const { ObjectId, Int32 } = require('mongodb');
mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Course = new Schema({
    name: { type: String, default:''},
    description: {type: String},
    price: {type: Number},
    sale: {type: Number,default:100},
    image:{type:String,require:true},
    chapter:[{type:mongoose.Schema.Types.ObjectId, ref:'Chapter'}],
    category:{type:String,require:true},
    teacher:{type:String,default:''},
    countBuy:{type:Number,default:0},
    countView:{type:Number,default:0},
    viewWeek:{type:Number,default:0},
    status:{type:Boolean,default:false},
    createAt:{type: Date, default: Date.now},
    updateAt:{type: Date, default: Date.now},
});
Course.index({ name: 'text',category:'text'});
module.exports = mongoose.model('Course', Course);
