import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Terminal } from "lucide-react";

const Header = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path
      ? "text-white"
      : "text-gray-400 hover:text-white";
  };

  return (
    <header className=" bg-black/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-xl tracking-tight text-white hover:text-gray-200 transition-colors"
        >
          <Terminal size={24} className="text-white" />
          <span>Devtales</span>
        </Link>

        <nav className="flex items-center gap-8 text-sm font-medium">
          <Link to="/" className={`${isActive("/")} transition-colors`}>
            Home
          </Link>
          <Link
            to="/blogs"
            className={`${isActive("/blogs")} transition-colors`}
          >
            Blogs
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
