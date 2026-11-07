const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthToken = () => {
  return localStorage.getItem('token');
};

const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

const request = async (endpoint, options = {}) => {
  const url = new URL(`${BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`);

  if (options.params) {
    Object.entries(options.params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        url.searchParams.append(key, val);
      }
    });
  }

  const headers = { ...options.headers };
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  if (!isFormData && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  let body = options.body;
  if (!isFormData && body && typeof body === 'object') {
    body = JSON.stringify(body);
  }

  const config = {
    ...options,
    headers,
    body,
  };

  delete config.params;

  const response = await fetch(url.toString(), config);

  if (response.status === 204) {
    return null;
  }

  let data = null;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const errorMsg =
      (data && typeof data === 'object' && (data.message || data.error)) ||
      `Yeu cau that bai voi ma loi ${response.status}`;
    const err = new Error(errorMsg);
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
};

const get = (endpoint, params = {}, options = {}) => {
  return request(endpoint, { ...options, method: 'GET', params });
};

const post = (endpoint, body = {}, options = {}) => {
  return request(endpoint, { ...options, method: 'POST', body });
};

const put = (endpoint, body = {}, options = {}) => {
  return request(endpoint, { ...options, method: 'PUT', body });
};

const patch = (endpoint, body = {}, options = {}) => {
  return request(endpoint, { ...options, method: 'PATCH', body });
};

const del = (endpoint, options = {}) => {
  return request(endpoint, { ...options, method: 'DELETE' });
};

export const api = {
  get,
  post,
  put,
  patch,
  delete: del,
  request,
  getAuthToken,
  setAuthToken,

  // Auth endpoints
  auth: {
    login: (email, matKhau) => post('/auth/login', { email, matKhau }),
    register: (payload) => post('/auth/register', payload),
    google: (credentialOrToken) => post('/auth/google', { credential: credentialOrToken, token: credentialOrToken }),
    getMe: () => get('/auth/me'),
    updatePreferences: (maLoaiHinhList) => put('/auth/preferences', { maLoaiHinhList }),
    updateProfile: (payload) => put('/auth/profile', payload),
    changePassword: (payload) => put('/auth/password', payload),
    uploadAvatar: (file) => {
      const formData = new FormData();
      formData.append('avatar', file);
      return post('/auth/avatar', formData);
    },
  },

  // Locations & Categories
  locations: {
    getAll: (params) => get('/locations', params),
    getById: (id) => get(`/locations/${id}`),
    getCategories: () => get('/categories'),
    getAmenities: () => get('/amenities'),
    getActivities: () => get('/activities'),
  },

  // Attractions
  attractions: {
    getAll: (params) => get('/attractions', params),
    getById: (id) => get(`/attractions/${id}`),
    addReview: (id, payload) => post(`/attractions/${id}/reviews`, payload),
  },

  // Hotels
  hotels: {
    getAll: (params) => get('/hotels', params),
    getById: (id) => get(`/hotels/${id}`),
    addReview: (id, payload) => post(`/hotels/${id}/reviews`, payload),
  },

  // AI Prediction
  ai: {
    predict: (file) => {
      const formData = new FormData();
      formData.append('image', file);
      return post('/ai/predict', formData);
    },
  },

  // Wishlist & History
  wishlist: {
    get: () => get('/wishlist'),
    toggle: (payload) => post('/wishlist/toggle', payload),
  },
  history: {
    get: (params) => get('/history', params),
    getAll: (params) => get('/history', params),
    delete: (id) => del(`/history/${id}`),
    clear: () => del('/history'),
  },

  // Admin
  admin: {
    getStats: () => get('/admin/stats'),
    getUsers: (params) => get('/admin/users', params),
    updateUserStatus: (id, trangThai) => patch(`/admin/users/${id}/status`, { trangThai }),
    createLocation: (data) => post('/admin/locations', data),
    updateLocation: (id, data) => put(`/admin/locations/${id}`, data),
    deleteLocation: (id) => del(`/admin/locations/${id}`),
    createAttraction: (data) => post('/admin/attractions', data),
    updateAttraction: (id, data) => put(`/admin/attractions/${id}`, data),
    deleteAttraction: (id) => del(`/admin/attractions/${id}`),
    createHotel: (data) => post('/admin/hotels', data),
    updateHotel: (id, data) => put(`/admin/hotels/${id}`, data),
    deleteHotel: (id) => del(`/admin/hotels/${id}`),
    getReviews: (params) => get('/admin/reviews', params),
    updateReviewStatus: (type, id, status) => patch(`/admin/reviews/${type}/${id}/status`, { status }),
    deleteReview: (type, id) => del(`/admin/reviews/${type}/${id}`),
    createAmenity: (data) => post('/admin/amenities', data),
    updateAmenity: (id, data) => put(`/admin/amenities/${id}`, data),
    deleteAmenity: (id) => del(`/admin/amenities/${id}`),
    createActivity: (data) => post('/admin/activities', data),
    updateActivity: (id, data) => put(`/admin/activities/${id}`, data),
    deleteActivity: (id) => del(`/admin/activities/${id}`),
    uploadImage: (file) => {
      const formData = new FormData();
      formData.append('image', file);
      return post('/admin/upload', formData);
    },
  },
};

export default api;

