import express from "express";
import Post from "../models/Post.js";

const router = express.Router();

// GET /api/admin/posts - Get all posts (drafts + published)
router.get("/posts", async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (status) {
      filter.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Post.countDocuments(filter);
    const posts = await Post.find(filter)
      .select("-content -likedIps")
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      posts,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET /api/admin/posts/:id - Get single post by ID (for editing)
router.get("/posts/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).select("-likedIps");
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// POST /api/admin/posts - Create new post
router.post("/posts", async (req, res) => {
  try {
    const {
      title,
      excerpt,
      content,
      category,
      tags,
      author,
      status,
      coverImage,
    } = req.body;

    // Generate unique slug
    let slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const existingPost = await Post.findOne({ slug });
    if (existingPost) {
      slug = `${slug}-${Date.now()}`;
    }

    const post = new Post({
      title,
      slug,
      excerpt,
      content,
      category,
      tags: tags || [],
      author: author || "Admin",
      status: status || "draft",
      coverImage: coverImage || "",
    });

    await post.save();
    res.status(201).json(post);
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: "Validation error", errors });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// PUT /api/admin/posts/:id - Update post
router.put("/posts/:id", async (req, res) => {
  try {
    const {
      title,
      excerpt,
      content,
      category,
      tags,
      author,
      status,
      coverImage,
    } = req.body;

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Update slug if title changed
    if (title && title !== post.title) {
      let newSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      const existingPost = await Post.findOne({
        slug: newSlug,
        _id: { $ne: post._id },
      });
      if (existingPost) {
        newSlug = `${newSlug}-${Date.now()}`;
      }
      post.slug = newSlug;
    }

    if (title !== undefined) post.title = title;
    if (excerpt !== undefined) post.excerpt = excerpt;
    if (content !== undefined) post.content = content;
    if (category !== undefined) post.category = category;
    if (tags !== undefined) post.tags = tags;
    if (author !== undefined) post.author = author;
    if (status !== undefined) post.status = status;
    if (coverImage !== undefined) post.coverImage = coverImage;

    await post.save();
    res.json(post);
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: "Validation error", errors });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// DELETE /api/admin/posts/:id - Delete post
router.delete("/posts/:id", async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
