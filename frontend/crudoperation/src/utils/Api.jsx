
import { getToken } from './Auth';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

const headers = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

const parseResponse = async (res) => {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(text);
  }
};

export const post = async (path, body) => {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body)
  });
  return parseResponse(res);
};

export const get = async (path) => {
  const res = await fetch(`${API_BASE}${path}`, { headers: headers() });
  return parseResponse(res);
};

export const put = async (path, body) => {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(body)
  });
  return parseResponse(res);
};

export const del = async (path) => {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'DELETE',
    headers: headers()
  });
  return parseResponse(res);
};
