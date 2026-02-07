import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    authorName: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: 100,
    },
    authorEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
    content: {
      type: String,
      required: [true, "Comment content is required"],
      maxlength: 2000,
    },
    likes: {
      type: Number,
      default: 0,
    },
    likedIps: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  },
);

// Index for faster queries
commentSchema.index({ postId: 1, createdAt: -1 });
commentSchema.index({ parentComment: 1 });

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
