import React from "react";

const Footer = () => {
  return (
    <footer className="border-t border-gray-800 bg-black mt-auto">
      <div className="max-w-5xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-gray-500 text-sm flex flex-col md:items-start items-center">
          <span>
            &copy; {new Date().getFullYear()} Devtales. All rights reserved.
          </span>
          <span className="mt-1">Created by Vivek</span>
        </div>
        <div className="flex gap-6 text-sm text-gray-500">
          <a
            href="https://github.com/bvvivek6"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://instagram.com/vivebv__"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            Instagram
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
