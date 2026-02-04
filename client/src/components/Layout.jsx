import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const Layout = ({ children }) => {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";

  return (
    <div className="min-h-screen flex flex-col bg-black text-gray-100 dm-sans selection:bg-gray-800 selection:text-white">
      {isLandingPage ? null : <Header />}
      <motion.main
        className={`flex-grow w-full ${!isLandingPage ? "max-w-5xl mx-auto px-6 py-12" : ""}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {children}
      </motion.main>
      <Footer />
    </div>
  );
};

export default Layout;
