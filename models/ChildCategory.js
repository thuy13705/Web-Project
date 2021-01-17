const mongoose = require("mongoose");

const schema = mongoose.Schema({
    name: String,
    category:String,
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    }],
});

module.exports = mongoose.model("ChildCategory", schema);