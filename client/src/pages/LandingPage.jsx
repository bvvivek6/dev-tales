import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getPosts } from "../services/postService";
import BlogCard from "../components/BlogCard";
import ColorBends from "../ColorBends";
import { ArrowRight } from "lucide-react";

const LandingPage = () => {
  const [recentPosts, setRecentPosts] = useState([]);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const { data } = await getPosts({ limit: 3 });
        setRecentPosts(data.posts);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    };
    fetchRecent();
  }, []);
  return (
    <div className="space-y-20 pb-12 dm-sans max-w-8xl mx-auto bg-black">
      <section className="relative h-[90vh] flex items-center  justify-start overflow-hidden ">
        <div className="absolute inset-0  pointer-events-none">
          <div className="bg-gradient-to-t from-black via-black/50 to-transparent h-60 w-full absolute bottom-0 z-10 to-transparent"></div>

          <ColorBends
            colors={["#0E3386", "#8a5cff", "#00ffd1"]}
            rotation={0}
            speed={0.2}
            scale={1}
            frequency={1}
            warpStrength={1}
            mouseInfluence={1}
            parallax={0.5}
            noise={0.1}
            transparent
            autoRotate={0}
            color=""
          />
        </div>
        <div className="relative z-10 flex flex-col justify-center items-start text-start space-y-6 px-6 md:px-16">
          <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400 pb-2 drop-shadow-sm">
            // Devtales
          </h1>
          <p className="text-xl text-gray-300 w-[220px] md:w-[400px] leading-tight drop-shadow-sm">
            Curated stories for developers, designers, and tech enthusiasts.
            Exploring the intersection of code, design, and user experience.
          </p>
          <div className="pt-4">
            <Link
              to="/blogs"
              className="inline-flex items-center px-6 py-3 border border-white/20 text-white bg-white/10 backdrop-blur-md rounded-full font-medium hover:bg-white/20 transition-all shadow-lg"
            >
              Start Reading
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl px-8 md:px-4 mx-auto">
        <div className="flex justify-between  items-end mb-6 pb-4">
          <h2 className="text-2xl font-bold text-white">Latest Stories</h2>
          <Link
            to="/blogs"
            className="text-sm text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
