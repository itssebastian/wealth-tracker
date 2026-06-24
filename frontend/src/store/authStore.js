import { create } from 'zustand';
import api from '../services/api';

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      set({ user: data.user, token: data.token, loading: false });
      return true;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Login failed', loading: false });
      return false;
    }
  },

  register: async (name, email, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      localStorage.setItem('token', data.token);
      set({ user: data.user, token: data.token, loading: false });
      return true;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Registration failed', loading: false });
      return false;
    }
  },

  fetchMe: async () => {
    try {
      const { data } = await api.get('/auth/me');
      set({ user: data.user });
    } catch {
      localStorage.removeItem('token');
      set({ user: null, token: null });
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },

  updateProfile: async (updates) => {
    const { data } = await api.put('/auth/profile', updates);
    set({ user: data.user });
  },
}));

export default useAuthStore;
