const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mongoSchema = new Schema({
    writer:{
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
    content: {type: String},
    rating:{type: Number},
    createAt:{type:Date, default: Date.now}
})

module.exports = mongoose.model('Feedback', mongoSchema);