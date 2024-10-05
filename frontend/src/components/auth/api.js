import axios from 'axios';

const API_URL = 'http://localhost:5000/';
const REFRESH_URL = `${API_URL}auth/token/refresh`;

let isRefreshing = false;
let failedQueue = [];

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

const setAccessToken = (token) => {
  axiosInstance.defaults.headers['Authorization'] = `Bearer ${token}`;
};

const processQueue = (error, token = null) => {
  failedQueue.forEach(promise => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}auth/login`, { username, password }, {
      headers: { 'Content-Type': 'application/json' },
    });

    const { access_token, refresh_token } = response.data;

    localStorage.setItem('access_token', access_token);

    setAccessToken(access_token);

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error response:', error.response.data);
      throw new Error(error.response.data.message || 'An error occurred');
    } else if (error.request) {
      console.error('No response:', error.request);
      throw new Error('No response from server');
    } else {
      console.error('Error message:', error.message);
      throw new Error('Error in request setup');
    }
  }
};

export const register = async (registerForm) => {
  try {
    const response = await axios.post(`${API_URL}auth/register`, registerForm, {
      headers: { 'Content-Type': 'application/json' },
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Registration error response:', error.response.data);
      throw new Error(error.response.data.message || 'Registration failed.');
    } else if (error.request) {
      console.error('No response during registration:', error.request);
      throw new Error('No response from server during registration.');
    } else {
      console.error('Error message during registration:', error.message);
      throw new Error('Error in registration request setup.');
    }
  }
};

export const logout = async () => {
  try {
    await axiosInstance.post('auth/logout');
    localStorage.removeItem('access_token');
    window.location.href = '/login';
  } catch (error) {
    console.error('Logout failed:', error);
    throw error;
  }
};

const refreshAccessToken = async () => {
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

export const fetchEvents = async () => {
  try {
    const response = await axiosInstance.get('events/events');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data.message || 'Failed to fetch events.');
  }
};

export const fetchEvent = async (eventId) => {
  try {
    const response = await axiosInstance.get(`events/events/${eventId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data.message || 'Failed to fetch event.');
  }
};

export const createEvent = async (eventData) => {
  try {
    const response = await axiosInstance.post('events/events', eventData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data.message || 'Failed to create event.');
  }
};

export const updateEvent = async (eventId, eventData) => {
  try {
    const response = await axiosInstance.patch(`events/events/${eventId}`, eventData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data.message || 'Failed to update event.');
  }
};

export const deleteEvent = async (eventId) => {
  try {
    const response = await axiosInstance.delete(`events/events/${eventId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data.message || 'Failed to delete event.');
  }
};

export const fetchParticipants = async () => {
  try {
    const response = await axiosInstance.get('events/participants');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data.message || 'Failed to fetch participants.');
  }
};

export const fetchParticipant = async (participantId) => {
  try {
    const response = await axiosInstance.get(`events/participants/${participantId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data.message || 'Failed to fetch participant.');
  }
};

export const createParticipant = async (participantData) => {
  try {
    const response = await axiosInstance.post('events/participants', participantData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data.message || 'Failed to create participant.');
  }
};

export const updateParticipant = async (participantId, participantData) => {
  try {
    const response = await axiosInstance.patch(`events/participants/${participantId}`, participantData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data.message || 'Failed to update participant.');
  }
};

export const deleteParticipant = async (participantId) => {
  try {
    const response = await axiosInstance.delete(`events/participants/${participantId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data.message || 'Failed to delete participant.');
  }
};

export const fetchEventParticipants = async (eventId) => {
  try {
    const response = await axiosInstance.get(`events/events/${eventId}/participants`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data.message || 'Failed to fetch event participants.');
  }
};

export const addParticipantToEvent = async (eventId, participantData) => {
  try {
    const response = await axiosInstance.post(`events/events/${eventId}/participants`, participantData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data.message || 'Failed to add participant to event.');
  }
};

export const fetchEventParticipant = async (eventId, eventParticipantId) => {
  try {
    const response = await axiosInstance.get(`events/events/${eventId}/participants/${eventParticipantId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data.message || 'Failed to fetch event participant.');
  }
};

export const updateEventParticipant = async (eventId, eventParticipantId, updateData) => {
  try {
    const response = await axiosInstance.patch(`events/events/${eventId}/participants/${eventParticipantId}`, updateData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data.message || 'Failed to update event participant.');
  }
};

export const removeParticipantFromEvent = async (eventId, eventParticipantId) => {
  try {
    const response = await axiosInstance.delete(`events/events/${eventId}/participants/${eventParticipantId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data.message || 'Failed to remove participant from event.');
  }
};

export const fetchUpcomingEventsForParticipant = async (participantId) => {
  try {
    const response = await axiosInstance.get(`events/participants/${participantId}/upcoming-events`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch upcoming events:', error);
    throw new Error('Failed to fetch upcoming events.');
  }
};

export const fetchMealsForEvent = async (eventId) => {
  try {
    const response = await axiosInstance.get(`events/events/${eventId}/meals`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data.message || 'Failed to fetch meals for the event.');
  }
};

export const fetchMealDetails = async (eventId, mealId) => {
  try {
    const response = await axiosInstance.get(`events/events/${eventId}/meals/${mealId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data.message || 'Failed to fetch meal details.');
  }
};

export const addMealToEvent = async (eventId, mealData) => {
  try {
    const response = await axiosInstance.post(`events/events/${eventId}/meals`, mealData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data.message || 'Failed to add meal to event.');
  }
};

export const updateMealOnEvent = async (eventId, mealId, mealData) => {
  try {
    const response = await axiosInstance.patch(`events/events/${eventId}/meals/${mealId}`, mealData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data.message || 'Failed to update meal on event.');
  }
};

export const deleteMealFromEvent = async (eventId, mealId) => {
  try {
    const response = await axiosInstance.delete(`events/events/${eventId}/meals/${mealId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data.message || 'Failed to delete meal from event.');
  }
};

export const fetchParticipantMealsOnEvent = async (eventId, participantId) => {
  try {
    const response = await axiosInstance.get(`events/events/${eventId}/participants/${participantId}/meals`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data.message || 'Failed to fetch participant meals for the event.');
  }
};

export const addParticipantMealsToEvent = async (eventId, participantId, mealsData) => {
  try {
    const response = await axiosInstance.post(`events/events/${eventId}/participants/${participantId}/meals`, mealsData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data.message || 'Failed to add participant meal to event.');
  }
};

export const fetchParticipantMealDetails = async (eventId, participantMealId) => {
  try {
    const response = await axiosInstance.get(`events/events/${eventId}/participants/meals/${participantMealId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data.message || 'Failed to fetch participant meal details.');
  }
};

export const updateParticipantMealOnEvent = async (eventId, participantMealId, mealData) => {
  try {
    const response = await axiosInstance.patch(`events/events/${eventId}/participants/meals/${participantMealId}`, mealData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data.message || 'Failed to update participant meal on event.');
  }
};

export const deleteParticipantMealOnEvent = async (eventId, participantMealId) => {
  try {
    const response = await axiosInstance.delete(`events/events/${eventId}/participants/meals/${participantMealId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data.message || 'Failed to delete participant meal on event.');
  }
};

axiosInstance.interceptors.request.use(
  async (config) => {
    let accessToken = localStorage.getItem('access_token');

    if (!accessToken || isTokenExpired(accessToken)) {
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          accessToken = await refreshAccessToken();
          processQueue(null, accessToken);
        } catch (error) {
          processQueue(error, null);
          throw error;
        } finally {
          isRefreshing = false;
        }
      }

      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token) => {
            config.headers['Authorization'] = `Bearer ${token}`;
            resolve(config);
          },
          reject: (error) => {
            reject(error);
          },
        });
      });
    }

    config.headers['Authorization'] = `Bearer ${accessToken}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const TOKEN_REFRESH_THRESHOLD = 60;

const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;

    return payload.exp < currentTime + TOKEN_REFRESH_THRESHOLD;
  } catch (error) {
    console.error('Invalid token format:', error);
    return true;
  }
};

export default axiosInstance;
