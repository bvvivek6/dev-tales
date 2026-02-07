import api from "./api";

export const getComments = (postId) => api.get(`/posts/${postId}/comments`);

export const addComment = (postId, data) =>
  api.post(`/posts/${postId}/comments`, data);

export const likeComment = (postId, commentId) =>
  api.post(`/posts/${postId}/comments/${commentId}/like`);
