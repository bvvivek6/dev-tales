import React, { useState, useEffect } from "react";
import { getPosts } from "../services/postService";
import BlogCard from "../components/BlogCard";
import { Search, Loader2 } from "lucide-react";

const BlogListingPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data } = await getPosts({ limit: 50 });
      setPosts(data.posts);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-12 max-w-6xl mx-auto">
      <section className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight"># Blog</h1>
        <p className="text-md leading-tight text-gray-400 max-w-2xl">
          Thoughts, tutorials, and insights on software development, design
          patterns, and industry trends.
        </p>

        <div className="relative max-w-lg">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-800 rounded-full leading-5 bg-black placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 sm:text-sm transition-colors text-white"
          />
        </div>
      </section>

      <section>
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-gray-500" />
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">
            No posts found matching your search.
          </div>
        )}
      </section>
    </div>
  );
};

export default BlogListingPage;
