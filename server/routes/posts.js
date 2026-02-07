import express from "express";
import Post from "../models/Post.js";

const router = express.Router();

// GET /api/posts - Get all published posts
router.get("/", async (req, res) => {
  try {
    const { category, search, page = 1, limit = 12 } = req.query;
    const filter = { status: "published" };

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Post.countDocuments(filter);
    const posts = await Post.find(filter)
      .select("-content -likedIps")
      .sort({ createdAt: -1 })
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

// GET /api/posts/categories - Get all unique categories
router.get("/categories", async (req, res) => {
  try {
    const categories = await Post.distinct("category", {
      status: "published",
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET /api/posts/:slug - Get single post by slug
router.get("/:slug", async (req, res) => {
  try {
    const post = await Post.findOne({
      slug: req.params.slug,
      status: "published",
    }).select("-likedIps");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// POST /api/posts/:id/like - Like/unlike a post
router.post("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const clientIp = req.headers["x-forwarded-for"] || req.ip || "anon";

    if (post.likedIps.includes(clientIp)) {
      // Unlike
      post.likedIps = post.likedIps.filter((ip) => ip !== clientIp);
      post.likes = Math.max(0, post.likes - 1);
    } else {
      // Like
      post.likedIps.push(clientIp);
      post.likes += 1;
    }

    await post.save();
    res.json({ likes: post.likes, liked: post.likedIps.includes(clientIp) });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
