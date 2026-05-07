const USERS_API = import.meta.env.VITE_USERS_API || 'http://localhost:8080/user';
const POSTS_API = import.meta.env.VITE_POSTS_API || 'http://localhost:8081/post';

async function apiGet(url) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || response.statusText);
  }
  return response.json();
}

async function apiPost(url, data) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || response.statusText);
  }
  return response.json();
}

export function fetchUsers() {
  return apiGet(`${USERS_API}/getusers`);
}

export function fetchUserById(id) {
  return apiGet(`${USERS_API}/${id}`);
}

export function createUser(user) {
  return apiPost(`${USERS_API}/createusers`, user);
}

export function fetchPosts() {
  return apiGet(`${POSTS_API}/getPosts`);
}

export function createPost(post) {
  return apiPost(`${POSTS_API}/createPost`, post);
}
