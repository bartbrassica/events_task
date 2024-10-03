import axios from 'axios';
import { clearAuthData } from '../../auth';

const API_URL = 'http://localhost:5000/auth';
const REFRESH_URL = `${API_URL}/token/refresh`;

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

const setAccessToken = (token) => {
  axiosInstance.defaults.headers['Authorization'] = `Bearer ${token}`;
};

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { username, password }, {
      headers: { 'Content-Type': 'application/json' },
    });

    const { access_token, refresh_token } = response.data;

    localStorage.setItem('access_token', access_token);

    setAccessToken(access_token);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const register = async (registerForm) => {
  try {
    const response = await axios.post(`${API_URL}/register`, registerForm, {
      headers: { 'Content-Type': 'application/json' },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = async (dispatch) => {
    try {
      await axiosInstance.post('/logout');
  
      localStorage.removeItem('access_token');
  
      dispatch(clearAuthData());
  
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

export const refreshAccessToken = async () => {
  try {
    const response = await axios.post(REFRESH_URL, {}, { withCredentials: true });

    const { access_token } = response.data;

    localStorage.setItem('access_token', access_token);
    setAccessToken(access_token);

    return access_token;
  } catch (error) {
    console.error('Failed to refresh access token:', error);
    localStorage.removeItem('access_token');
    window.location.href = '/login';
    throw error;
  }
};

axiosInstance.interceptors.request.use(
  async (config) => {
    let accessToken = localStorage.getItem('access_token');

    if (!accessToken || isTokenExpired(accessToken)) {
      accessToken = await refreshAccessToken();
    }

    config.headers['Authorization'] = `Bearer ${accessToken}`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const isTokenExpired = (token) => {
  const payload = JSON.parse(atob(token.split('.')[1]));
  const currentTime = Date.now() / 1000;

  return payload.exp < currentTime;
};

export default axiosInstance;
