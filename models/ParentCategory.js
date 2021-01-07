const mongoose = require("mongoose");

const schema = mongoose.Schema({
    name: String,
    child: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "ChildCategory",
    }],
});

module.exports = mongoose.model("ParentCategory", schema);