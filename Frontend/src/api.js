const USERS_API = import.meta.env.VITE_USERS_API || 'http://localhost:8080/user';
const POSTS_API = import.meta.env.VITE_POSTS_API || 'http://localhost:8081/post';
const COMMENTS_API = import.meta.env.VITE_COMMENTS_API || 'http://localhost:8081/comment';
const VOTES_API = import.meta.env.VITE_VOTES_API || 'http://localhost:8081/vote';

// Base URL for Posts Service (Port 8081)
const POSTS_BASE_URL = POSTS_API.replace('/post', '');

/**
 * Base helper for making API requests.
 */
async function apiRequest(url, method = 'GET', data = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const body = await response.text();
      throw new Error(body || response.statusText);
    }
    const text = await response.text();
    return text ? JSON.parse(text) : {};
  } catch (error) {
    console.error(`API Error (${method} ${url}):`, error);
    throw error;
  }
}

async function apiGet(url) { return apiRequest(url, 'GET'); }
async function apiPost(url, data) { return apiRequest(url, 'POST', data); }
async function apiPut(url, data) { return apiRequest(url, 'PUT', data); }
async function apiDelete(url) { return apiRequest(url, 'DELETE'); }

export function fetchUsers() {
  return apiGet(`${USERS_API}/getusers`);
}

export function fetchUserById(id) {
  return apiGet(`${USERS_API}/${id}`);
}

export function createUser(user) {
  return apiPost(`${USERS_API}/createusers`, user);
}

export function loginUser(credentials) {
  return apiPost(`${USERS_API}/login`, credentials);
}

export function updateUser(id, user) {
  return apiPut(`${USERS_API}/update/${id}`, user);
}

export function fetchPosts() {
  return apiGet(`${POSTS_API}/getPosts`);
}

export function fetchPostById(id) {
  return apiGet(`${POSTS_API}/${id}`);
}

export function createPost(post) {
  return apiPost(`${POSTS_API}/createPost`, post);
}

export function updatePost(id, post) {
  return apiPut(`${POSTS_API}/update/${id}`, post);
}

export function deletePost(id) {
  return apiDelete(`${POSTS_API}/delete/${id}`);
}

export function fetchCommentsByPostId(postId) {
  return apiGet(`${COMMENTS_API}/${postId}`);
}

export function createComment(comment) {
  return apiPost(`${COMMENTS_API}/createComment`, comment);
}

export function updateComment(id, comment) {
  return apiPut(`${COMMENTS_API}/update/${id}`, comment);
}

export function deleteComment(id) {
  return apiDelete(`${COMMENTS_API}/delete/${id}`);
}

// Voting API
export function votePost(postId, userId, upvote) {
  return apiPost(`${VOTES_API}/post/${postId}?userID=${userId}&upvote=${upvote}`, {});
}

export function fetchPostVoteCount(postId) {
  return apiGet(`${VOTES_API}/post/${postId}/count`);
}

export function voteComment(commentId, userId, upvote) {
  return apiPost(`${VOTES_API}/comment/${commentId}?userID=${userId}&upvote=${upvote}`, {});
}

export function fetchCommentVoteCount(commentId) {
  return apiGet(`${VOTES_API}/comment/${commentId}/count`);
}

/**
 * Robust image getter that handles local relative paths and remote URLs.
 */
export function getImageUrl(path) {
  if (!path) return null;
  if (path.startsWith('data:') || path.startsWith('http')) {
    return path;
  }
  // Ensure we point to the root of the Posts service (Port 8081)
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${POSTS_BASE_URL}${cleanPath}`;
}

export async function uploadImage(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${POSTS_API}/uploadImage`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to upload image');
  }

  return response.text(); // Returns path like /uploads/xyz.jpg
}
