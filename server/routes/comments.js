import express from "express";
import Comment from "../models/Comment.js";
import Post from "../models/Post.js";

const router = express.Router();

// GET /api/posts/:postId/comments - Get all comments for a post (nested)
router.get("/:postId/comments", async (req, res) => {
  try {
    const { postId } = req.params;

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Get top-level comments
    const comments = await Comment.find({
      postId,
      parentComment: null,
    })
      .select("-likedIps")
      .sort({ createdAt: -1 });

    // Get all replies
    const replies = await Comment.find({
      postId,
      parentComment: { $ne: null },
    })
      .select("-likedIps")
      .sort({ createdAt: 1 });

    // Nest replies under their parent comments
    const commentsWithReplies = comments.map((comment) => {
      const commentObj = comment.toObject();
      commentObj.replies = replies.filter(
        (reply) => reply.parentComment.toString() === comment._id.toString(),
      );
      return commentObj;
    });

    res.json({
      comments: commentsWithReplies,
      total: comments.length + replies.length,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// POST /api/posts/:postId/comments - Add a comment
router.post("/:postId/comments", async (req, res) => {
  try {
    const { postId } = req.params;
    const { authorName, authorEmail, content, parentComment } = req.body;

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // If replying, check parent comment exists
    if (parentComment) {
      const parent = await Comment.findById(parentComment);
      if (!parent) {
        return res.status(404).json({ message: "Parent comment not found" });
      }
    }

    const comment = new Comment({
      postId,
      authorName,
      authorEmail: authorEmail || "",
      content,
      parentComment: parentComment || null,
    });

    await comment.save();

    const savedComment = await Comment.findById(comment._id).select(
      "-likedIps",
    );
    res.status(201).json(savedComment);
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: "Validation error", errors });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// POST /api/posts/:postId/comments/:commentId/like - Like/unlike a comment
router.post("/:postId/comments/:commentId/like", async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const clientIp = req.headers["x-forwarded-for"] || req.ip || "anon";

    if (comment.likedIps.includes(clientIp)) {
      comment.likedIps = comment.likedIps.filter((ip) => ip !== clientIp);
      comment.likes = Math.max(0, comment.likes - 1);
    } else {
      comment.likedIps.push(clientIp);
      comment.likes += 1;
    }

    await comment.save();
    res.json({
      likes: comment.likes,
      liked: comment.likedIps.includes(clientIp),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
