import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar } from "lucide-react";

const BlogCard = ({ post }) => {
  return (
    <Link
      to={`/blogs/${post.id}`}
      className="group relative flex flex-col p-6 h-[300px] hover:bg-white/3 hover:border-white/10 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/5 overflow-hidden"
    >
      <div className="absolute bottom-0 left-0 -mr-6 -mb-4 w-48 h-52 bg-gradient-to-br from-blue-700  to-[#00ffd1]/60  blur-xl group-hover:scale-140 transition-transform duration-500" />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center px-3 py-1 text-xs font-medium text-white/70">
            {post.category}
          </span>
          <span className="flex items-center text-xs text-white/70 font-mono">
            <Calendar size={12} className="mr-1.5" />
            {post.date}
          </span>
        </div>

        <h3 className="text-xl md:text-2xl font-medium text-gray-100 mb-3 group-hover:text-white transition-colors leading-tight">
          {post.title}
        </h3>

        <p className="text-[#c0c0c0] text-sm  font-light mb-6 mt-2 line-clamp-3 flex-grow">
          {post.excerpt}
        </p>

        <div className="flex items-center text-sm font-medium text-white/70 group-hover:text-white mt-auto pt-4 border-t border-white/5">
          <span>Read article</span>
          <ArrowRight
            size={16}
            className="ml-2 transform text-white/50 group-hover:translate-x-1 group-hover:text-white transition-all duration-300"
          />
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
