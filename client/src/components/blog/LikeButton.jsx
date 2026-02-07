import React, { useState } from "react";
import { Heart } from "lucide-react";
import { likePost } from "../../services/postService";

const LikeButton = ({ postId, initialLikes = 0 }) => {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const [animating, setAnimating] = useState(false);

  const handleLike = async () => {
    try {
      setAnimating(true);
      const { data } = await likePost(postId);
      setLikes(data.likes);
      setLiked(data.liked);
      setTimeout(() => setAnimating(false), 300);
    } catch (error) {
      console.error("Failed to like:", error);
      setAnimating(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 ${
        liked
          ? "border-red-500/30 bg-red-500/10 text-red-400"
          : "border-gray-800 text-gray-400 hover:border-gray-600 hover:text-white"
      }`}
    >
      <Heart
        size={18}
        className={`transition-transform duration-300 ${animating ? "scale-125" : "scale-100"}`}
        fill={liked ? "currentColor" : "none"}
      />
      <span className="text-sm font-medium">{likes}</span>
    </button>
  );
};

export default LikeButton;
