import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar } from "lucide-react";

const BlogCard = ({ post }) => {
  return (
    <Link
      to={`/blogs/${post.id}`}
      className="group relative flex flex-col p-6 h-full rounded-4xl border border-white/10  hover:bg-white/3 hover:border-white/10 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/5 overflow-hidden"
    >
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-42 bg-gradient-to-br from-purple-500/40 to-blue-500/0 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center px-3 py-1 text-xs font-medium text-gray-300 ">
            # {post.category}
          </span>
          <span className="flex items-center text-xs text-gray-500 font-mono">
            <Calendar size={12} className="mr-1.5" />
            {post.date}
          </span>
        </div>

        <h3 className="text-xl md:text-2xl font-medium text-gray-100 mb-3 group-hover:text-white transition-colors leading-tight">
          {post.title}
        </h3>

        <p className="text-[#818181] text-sm  font-light mb-6 mt-2 line-clamp-3 flex-grow">
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
