const mongoose = require("mongoose");
const { Schema, model } = mongoose;

// Schema for the comments
const commentSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  animeId: {
    type: Number,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  parentId: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // this is a reference to the user model
  author: {
    // type object id
    type: mongoose.SchemaTypes.ObjectId,
    // reference to user model
    ref: "User",
    required: true,
  },
});

const Comment = model("Comment", commentSchema);

module.exports = Comment;