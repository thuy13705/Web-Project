const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Cart = new Schema({
    course:[{type:mongoose.Schema.Types.ObjectId, ref:'Chapter'}],
});

// Cart.index({'name': 'text'});
module.exports = mongoose.model('Cart', Cart);