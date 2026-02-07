import React, { useState, useEffect } from "react";
import {
  Heart,
  MessageCircle,
  Send,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  getComments,
  addComment,
  likeComment,
} from "../../services/commentService";

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [replyName, setReplyName] = useState("");
  const [replyText, setReplyText] = useState("");
  const [expandedReplies, setExpandedReplies] = useState({});

  const fetchComments = async () => {
    try {
      const { data } = await getComments(postId);
      setComments(data.comments);
      setTotal(data.total);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postId) fetchComments();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !commentText.trim()) return;

    try {
      setSubmitting(true);
      await addComment(postId, {
        authorName: name.trim(),
        authorEmail: email.trim(),
        content: commentText.trim(),
      });
      setCommentText("");
      fetchComments();
    } catch (error) {
      console.error("Failed to add comment:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = async (parentId) => {
    if (!replyName.trim() || !replyText.trim()) return;

    try {
      await addComment(postId, {
        authorName: replyName.trim(),
        content: replyText.trim(),
        parentComment: parentId,
      });
      setReplyTo(null);
      setReplyName("");
      setReplyText("");
      fetchComments();
    } catch (error) {
      console.error("Failed to reply:", error);
    }
  };

  const handleLike = async (commentId) => {
    try {
      const { data } = await likeComment(postId, commentId);
      setComments((prev) =>
        prev.map((c) => {
          if (c._id === commentId) return { ...c, likes: data.likes };
          return {
            ...c,
            replies: c.replies?.map((r) =>
              r._id === commentId ? { ...r, likes: data.likes } : r,
            ),
          };
        }),
      );
    } catch (error) {
      console.error("Failed to like comment:", error);
    }
  };

  const toggleReplies = (commentId) => {
    setExpandedReplies((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const CommentItem = ({ comment, isReply = false }) => (
    <div className={`${isReply ? "ml-8 pl-4 border-l border-gray-800" : ""}`}>
      <div className="flex items-start gap-3 py-4">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
          {comment.authorName.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-white">
              {comment.authorName}
            </span>
            <span className="text-xs text-gray-600">
              {formatDate(comment.createdAt)}
            </span>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
            {comment.content}
          </p>
          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={() => handleLike(comment._id)}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-400 transition-colors"
            >
              <Heart size={14} />
              {comment.likes > 0 && comment.likes}
            </button>
            {!isReply && (
              <button
                onClick={() =>
                  setReplyTo(replyTo === comment._id ? null : comment._id)
                }
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-white transition-colors"
              >
                <MessageCircle size={14} />
                Reply
              </button>
            )}
          </div>

          {/* Reply form */}
          {replyTo === comment._id && (
            <div className="mt-3 space-y-2">
              <input
                type="text"
                value={replyName}
                onChange={(e) => setReplyName(e.target.value)}
                placeholder="Your name"
                className="w-full px-3 py-2 text-sm bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-gray-600"
              />
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Reply to ${comment.authorName}...`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleReply(comment._id);
                  }}
                  className="flex-1 px-3 py-2 text-sm bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-gray-600"
                />
                <button
                  onClick={() => handleReply(comment._id)}
                  className="p-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div>
          <button
            onClick={() => toggleReplies(comment._id)}
            className="flex items-center gap-1 ml-11 text-xs text-gray-500 hover:text-white transition-colors mb-1"
          >
            {expandedReplies[comment._id] ? (
              <ChevronUp size={14} />
            ) : (
              <ChevronDown size={14} />
            )}
            {comment.replies.length}{" "}
            {comment.replies.length === 1 ? "reply" : "replies"}
          </button>
          {expandedReplies[comment._id] &&
            comment.replies.map((reply) => (
              <CommentItem key={reply._id} comment={reply} isReply />
            ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="mt-16 pt-8 border-t border-gray-800">
      <h3 className="text-xl font-bold text-white mb-6">
        Comments {total > 0 && `(${total})`}
      </h3>

      {/* New comment form */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name *"
            required
            className="px-4 py-3 bg-gray-900/50 border border-gray-800 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gray-600"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email (optional)"
            className="px-4 py-3 bg-gray-900/50 border border-gray-800 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gray-600"
          />
        </div>
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Write a comment..."
          required
          rows={3}
          className="w-full px-4 py-3 bg-gray-900/50 border border-gray-800 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gray-600 resize-none"
        />
        <button
          type="submit"
          disabled={submitting || !name.trim() || !commentText.trim()}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-full text-sm font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          <Send size={14} />
          {submitting ? "Posting..." : "Post Comment"}
        </button>
      </form>

      {/* Comments list */}
      {loading ? (
        <div className="text-center py-10 text-gray-500 text-sm">
          Loading comments...
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-10 text-gray-600 text-sm">
          No comments yet. Be the first to share your thoughts!
        </div>
      ) : (
        <div className="divide-y divide-gray-800/50">
          {comments.map((comment) => (
            <CommentItem key={comment._id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
