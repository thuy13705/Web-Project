const mongoose = require("mongoose");

const schema = mongoose.Schema({
    name: String,
    parentCategories: [{
        type: mongoose.Types.ObjectId,
        ref: "ParentCategory",
    }],
});

module.exports = mongoose.model("ChildCategory", schema);