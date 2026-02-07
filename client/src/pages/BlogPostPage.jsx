import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getPostBySlug } from "../services/postService";
import { ArrowLeft, Calendar, Clock, Tag, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import LikeButton from "../components/blog/LikeButton";
import CommentSection from "../components/blog/CommentSection";

const BlogPostPage = () => {
  const { id: slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const { data } = await getPostBySlug(slug);
        setPost(data);
      } catch (error) {
        if (error.response?.status === 404) {
          setNotFound(true);
        }
        console.error("Failed to fetch post:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-gray-500" />
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Post not found</h2>
        <Link to="/blogs" className="text-blue-400 hover:text-blue-300">
          Back to all blogs
        </Link>
      </div>
    );
  }

  const dateStr = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article className="max-w-6xl mx-auto">
      <div className="mb-8">
        <Link
          to="/blogs"
          className="inline-flex items-center text-sm text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" /> Back to blogs
        </Link>

        <div className="flex flex-wrap gap-4 items-center text-sm text-gray-500 mb-6 font-mono">
          <span className="flex items-center gap-1.5">
            <Tag size={14} />
            {post.category}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar size={14} />
            {dateStr}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={14} />
            {post.readTime}
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
          {post.title}
        </h1>

        <p className="text-xl text-gray-400 leading-relaxed border-l-2 border-gray-700 pl-4">
          {post.excerpt}
        </p>
      </div>

      {post.coverImage && (
        <div className="mb-10 rounded-xl overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-auto object-cover"
          />
        </div>
      )}

      <div className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-a:text-blue-400 prose-code:text-pink-400 prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-800">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>

      {/* Like button */}
      <div className="mt-10 pt-6 border-t border-gray-800 flex items-center gap-4">
        <LikeButton postId={post._id} initialLikes={post.likes || 0} />
        <span className="text-sm text-gray-500">
          {post.author && `Written by ${post.author}`}
        </span>
      </div>

      {/* Comments */}
      <CommentSection postId={post._id} />
    </article>
  );
};

export default BlogPostPage;
