import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import LandingPage from "./pages/LandingPage";
import BlogListingPage from "./pages/BlogListingPage";
import BlogPostPage from "./pages/BlogPostPage";
import DashboardPage from "./pages/DashboardPage";
import PostEditorPage from "./pages/PostEditorPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/blogs" element={<BlogListingPage />} />
            <Route path="/blogs/:id" element={<BlogPostPage />} />
            <Route path="/login" element={<LoginPage />} />

            <Route element={<ProtectedRoute />}>
              <Route
                path="/secure/blog/dashboard"
                element={<DashboardPage />}
              />
              <Route
                path="/secure/blog/dashboard/new"
                element={<PostEditorPage />}
              />
              <Route
                path="/secure/blog/dashboard/edit/:id"
                element={<PostEditorPage />}
              />
            </Route>
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;
