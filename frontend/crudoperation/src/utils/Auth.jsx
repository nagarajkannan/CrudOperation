// utils/Auth.js

// Save token in localStorage
export const setToken = (token) => localStorage.setItem('token', token);
export const getToken = () => localStorage.getItem('token');

// Save current user in localStorage
export const setUser = (user) => localStorage.setItem('user', JSON.stringify(user));
export const getCurrentUser = () => {
  const u = localStorage.getItem('user');
  return u ? JSON.parse(u) : null;
};

// Remove token & user
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
