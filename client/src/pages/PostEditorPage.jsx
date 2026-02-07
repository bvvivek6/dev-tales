import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Send, Eye, X, Tag, Loader2 } from "lucide-react";
import RichTextEditor from "../components/editor/RichTextEditor";
import { createPost, updatePost, getAdminPost } from "../services/postService";

const PostEditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [author, setAuthor] = useState("Admin");
  const [coverImage, setCoverImage] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEditing);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (isEditing) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      const { data } = await getAdminPost(id);
      setTitle(data.title);
      setExcerpt(data.excerpt);
      setContent(data.content);
      setCategory(data.category);
      setTags(data.tags || []);
      setAuthor(data.author || "Admin");
      setCoverImage(data.coverImage || "");
    } catch (error) {
      console.error("Failed to fetch post:", error);
      navigate("/secure/blog/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (status = "draft") => {
    if (
      !title.trim() ||
      !content.trim() ||
      !excerpt.trim() ||
      !category.trim()
    ) {
      alert(
        "Please fill in all required fields: Title, Excerpt, Category, and Content.",
      );
      return;
    }

    try {
      setSaving(true);
      const postData = {
        title: title.trim(),
        excerpt: excerpt.trim(),
        content,
        category: category.trim(),
        tags,
        author: author.trim() || "Admin",
        status,
        coverImage,
      };

      if (isEditing) {
        await updatePost(id, postData);
      } else {
        await createPost(postData);
      }

      navigate("/secure/blog/dashboard");
    } catch (error) {
      console.error("Failed to save post:", error);
      alert("Failed to save post. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/secure/blog/dashboard")}
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white border border-gray-800 rounded-full hover:border-gray-600 transition-colors"
          >
            <Eye size={16} />
            {showPreview ? "Editor" : "Preview"}
          </button>
          <button
            onClick={() => handleSave("draft")}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm text-white border border-gray-700 rounded-full hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            {saving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            Save Draft
          </button>
          <button
            onClick={() => handleSave("published")}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 text-sm bg-white text-black rounded-full font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            {saving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
            Publish
          </button>
        </div>
      </div>

      {showPreview ? (
        /* Preview Mode */
        <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-8">
          <div className="flex flex-wrap gap-3 mb-4 text-sm text-gray-500">
            {category && (
              <span className="px-3 py-1 bg-white/5 rounded-full">
                {category}
              </span>
            )}
            {tags.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-white/5 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            {title || "Untitled Post"}
          </h1>
          <p className="text-xl text-gray-400 mb-8 border-l-2 border-gray-700 pl-4">
            {excerpt || "No excerpt"}
          </p>
          <div
            className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-a:text-blue-400 prose-code:text-pink-400 prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-800 prose-img:rounded-lg"
            dangerouslySetInnerHTML={{ __html: content || "<p>No content</p>" }}
          />
        </div>
      ) : (
        /* Editor Mode */
        <div className="space-y-6">
          {/* Title */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title..."
            className="w-full text-4xl font-bold bg-transparent border-none outline-none text-white placeholder-gray-600 tracking-tight"
          />

          {/* Excerpt */}
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Write a short excerpt or description..."
            rows={2}
            className="w-full text-lg bg-transparent border border-gray-800 rounded-xl px-4 py-3 text-gray-300 placeholder-gray-600 focus:outline-none focus:border-gray-600 resize-none"
          />

          {/* Meta info row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-medium uppercase tracking-wider">
                Category *
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Tech, Design, Tutorial"
                className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-800 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-medium uppercase tracking-wider">
                Author
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Author name"
                className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-800 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-medium uppercase tracking-wider">
                Cover Image URL
              </label>
              <input
                type="text"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-800 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gray-600"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 font-medium uppercase tracking-wider">
              Tags
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-white/5 border border-gray-800 rounded-full text-sm text-gray-300"
                >
                  <Tag size={12} />
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-gray-500 hover:text-white ml-1"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Add a tag..."
                className="px-3 py-1 bg-transparent border-none outline-none text-sm text-white placeholder-gray-600 min-w-[120px]"
              />
            </div>
          </div>

          {/* Rich Text Editor */}
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 font-medium uppercase tracking-wider">
              Content *
            </label>
            <RichTextEditor content={content} onChange={setContent} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PostEditorPage;
