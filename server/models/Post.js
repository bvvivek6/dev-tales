import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    excerpt: {
      type: String,
      required: [true, "Excerpt is required"],
      maxlength: 500,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    coverImage: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    author: {
      type: String,
      default: "Admin",
      trim: true,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    readTime: {
      type: String,
      default: "1 min read",
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

// Generate slug from title before validation
postSchema.pre("validate", function () {
  if (this.title && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
});

// Calculate read time before saving
postSchema.pre("save", function () {
  if (this.content) {
    const plainText = this.content.replace(/<[^>]+>/g, "");
    const wordCount = plainText.split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(wordCount / 200));
    this.readTime = `${minutes} min read`;
  }
});

// Index for faster queries
postSchema.index({ status: 1, createdAt: -1 });
postSchema.index({ category: 1 });

const Post = mongoose.model("Post", postSchema);

export default Post;
