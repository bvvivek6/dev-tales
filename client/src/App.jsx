import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import LandingPage from "./pages/LandingPage";
import BlogListingPage from "./pages/BlogListingPage";
import BlogPostPage from "./pages/BlogPostPage";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/blogs" element={<BlogListingPage />} />
          <Route path="/blogs/:id" element={<BlogPostPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
