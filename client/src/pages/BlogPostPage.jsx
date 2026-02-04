import React from "react";
import { useParams, Link } from "react-router-dom";
import { posts } from "../data/posts";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import { motion } from "framer-motion";

const BlogPostPage = () => {
  const { id } = useParams();
  const post = posts.find((p) => p.id === parseInt(id));

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Post not found</h2>
        <Link to="/blogs" className="text-blue-400 hover:text-blue-300">
          Back to all blogs
        </Link>
      </div>
    );
  }

  return (
    <article
      className="max-w-6xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
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
            {post.date}
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

      <div className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-a:text-blue-400 prose-code:text-pink-400 prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-800">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
    </article>
  );
};

export default BlogPostPage;
