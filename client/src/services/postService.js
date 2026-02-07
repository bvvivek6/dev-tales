import api from "./api";

// Public endpoints
export const getPosts = (params = {}) => api.get("/posts", { params });

export const getPostBySlug = (slug) => api.get(`/posts/${slug}`);

export const getCategories = () => api.get("/posts/categories");

export const likePost = (id) => api.post(`/posts/${id}/like`);

// Admin endpoints
export const getAdminPosts = (params = {}) =>
  api.get("/admin/posts", { params });

export const getAdminPost = (id) => api.get(`/admin/posts/${id}`);

export const createPost = (data) => api.post("/admin/posts", data);

export const updatePost = (id, data) => api.put(`/admin/posts/${id}`, data);

export const deletePost = (id) => api.delete(`/admin/posts/${id}`);

// Image upload
export const uploadImage = (file) => {
  const formData = new FormData();
  formData.append("image", file);
  return api.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
