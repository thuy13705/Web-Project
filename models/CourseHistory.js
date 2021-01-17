const { MongooseDocument } = require('mongoose');
const course = require('../middlewares/course');
const Lesson = require('./Lesson');

const Schema=mongoose.Schema;

const course=new Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    course:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    lastvideo:{
        chapter:{type:Number},
        lesson:{type:Number}
    }
})
module.exports=mongoose.model('CourseHistory',course);