const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper to get stored token
function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

// Generic fetch wrapper
async function request(endpoint: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) {
    headers['x-auth-token'] = token;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.msg || data.message || 'Something went wrong');
  }
  return data;
}

// ─── Auth ────────────────────────────────────
export async function loginUser(email: string, password: string) {
  const data = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  return data;
}

export async function registerUser(payload: {
  name: string;
  email: string;
  password: string;
  role: string;
  skills: string[];
  interests: string[];
  location: string;
}) {
  const data = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  return data;
}

export async function fetchMe() {
  return request('/auth/me');
}

export function logoutUser() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export function getCurrentUser() {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('user');
  return raw ? JSON.parse(raw) : null;
}

export function isLoggedIn(): boolean {
  return !!getToken();
}

// ─── Help Requests ───────────────────────────
export async function getRequests(filters?: { category?: string; urgency?: string; tag?: string }) {
  const params = new URLSearchParams();
  if (filters?.category) params.set('category', filters.category);
  if (filters?.urgency) params.set('urgency', filters.urgency);
  if (filters?.tag) params.set('tag', filters.tag);
  const qs = params.toString();
  return request(`/requests${qs ? `?${qs}` : ''}`);
}

export async function getRequestById(id: string) {
  return request(`/requests/${id}`);
}

export async function getMyRequests() {
  return request('/requests/me');
}

export async function createRequest(payload: {
  title: string;
  description: string;
  category: string;
  tags: string[];
  urgency: string;
}) {
  return request('/requests', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function offerHelp(requestId: string) {
  return request(`/requests/${requestId}/offer-help`, {
    method: 'POST',
  });
}

export async function markSolved(requestId: string, helperId?: string) {
  return request(`/requests/${requestId}/solve`, {
    method: 'POST',
    body: JSON.stringify({ helperId }),
  });
}

export async function addMessage(requestId: string, text: string) {
  return request(`/requests/${requestId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ text }),
  });
}

// ─── Users / Leaderboard ─────────────────────
export async function getLeaderboard() {
  return request('/users/leaderboard');
}

export async function getUserProfile(id: string) {
  return request(`/users/${id}`);
}
