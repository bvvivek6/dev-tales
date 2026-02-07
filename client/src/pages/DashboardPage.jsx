import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Edit3,
  Trash2,
  Eye,
  FileText,
  Send,
  Clock,
  Heart,
  Terminal,
} from "lucide-react";
import { getAdminPosts, deletePost } from "../services/postService";

const DashboardPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter !== "all") params.status = filter;
      const { data } = await getAdminPosts(params);
      setPosts(data.posts);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  const handleDelete = async (id) => {
    try {
      await deletePost(id);
      setPosts(posts.filter((p) => p._id !== id));
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  const publishedCount = posts.filter((p) => p.status === "published").length;
  const draftCount = posts.filter((p) => p.status === "draft").length;
  const totalLikes = posts.reduce((sum, p) => sum + (p.likes || 0), 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Terminal size={28} className="text-white" />
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Dashboard
            </h1>
          </div>
          <p className="text-gray-400 text-sm">
            Manage your blog posts and content
          </p>
        </div>
        <Link
          to="/secure/blog/dashboard/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-full font-medium hover:bg-gray-200 transition-colors text-sm"
        >
          <Plus size={18} />
          New Post
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Send size={18} className="text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{publishedCount}</p>
              <p className="text-xs text-gray-500">Published</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/10 rounded-lg">
              <Clock size={18} className="text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{draftCount}</p>
              <p className="text-xs text-gray-500">Drafts</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <Heart size={18} className="text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{totalLikes}</p>
              <p className="text-xs text-gray-500">Total Likes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-gray-900/50 border border-gray-800 rounded-xl p-1 w-fit">
        {["all", "published", "draft"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              filter === f
                ? "bg-white/10 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Posts list */}
      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20">
          <FileText size={48} className="mx-auto text-gray-700 mb-4" />
          <p className="text-gray-500">No posts yet. Create your first one!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div
              key={post._id}
              className="flex items-center justify-between p-5 bg-gray-900/30 border border-gray-800/50 rounded-xl hover:border-gray-700 transition-colors group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-white font-medium truncate">
                    {post.title}
                  </h3>
                  <span
                    className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                      post.status === "published"
                        ? "bg-green-500/10 text-green-400"
                        : "bg-yellow-500/10 text-yellow-400"
                    }`}
                  >
                    {post.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>{post.category}</span>
                  <span>
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart size={12} /> {post.likes || 0}
                  </span>
                  <span>{post.readTime}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {post.status === "published" && (
                  <Link
                    to={`/blogs/${post.slug}`}
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    title="View"
                  >
                    <Eye size={16} />
                  </Link>
                )}
                <Link
                  to={`/secure/blog/dashboard/edit/${post._id}`}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit3 size={16} />
                </Link>
                {deleteConfirm === post._id ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="px-3 py-1 bg-red-500/20 text-red-400 text-xs rounded-lg hover:bg-red-500/30 transition-colors"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="px-3 py-1 text-gray-400 text-xs hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirm(post._id)}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
