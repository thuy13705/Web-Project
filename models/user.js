const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: false
  },
  lastName: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: false
  },
  address: {
    type: String,
    required: false
  },
  phoneNumber: {
    type: String,
    required: false
  },
  role: {
    type: Number,
    required: false,
    default: 0
  },
  isAuthenticated: {
    type: Boolean,
    required: false,
    default: false
  },
  isLock: {
    type: Boolean,
    required: false,
    default: false
  },
  verify_token: {
    type: String,
    required: false
  },
  watch_list: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
}],
  courses: [mongoose.Types.ObjectId],

});

module.exports = mongoose.model('User', userSchema);
