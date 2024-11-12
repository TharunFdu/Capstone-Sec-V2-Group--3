import axios from 'axios';

const API_URL = 'http://localhost:5001/api';
const getToken = () => localStorage.getItem('token');

export const register = async (name, email, password, role) => {
  const res = await axios.post(`${API_URL}/auth/register`, { name, email, password, role });
  return res.data;
};

export const login = async (email, password) => {
  const res = await axios.post(`${API_URL}/auth/login`, { email, password });
  return res.data;
};

export const getEvents = async (filters = {}) => {
  const token = getToken();
  const queryParams = new URLSearchParams(filters).toString();
  const response = await axios.get(`${API_URL}/events?${queryParams}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const getEventById = async (eventId) => {
  const token = getToken(); 
  try {
    const response = await axios.get(`${API_URL}/events/${eventId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching event details:', error);
    throw error;
  }
};


export const getVenues = async () => {
  const token = getToken();
  const response = await axios.get(`${API_URL}/venues`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const createEvent = async (eventData) => {
  const token = getToken();
  const response = await axios.post(`${API_URL}/events`, eventData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const updateEvent = async (id, eventData) => {
  const token = getToken();
  const response = await axios.put(`${API_URL}/events/${id}`, eventData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const deleteEvent = async (id) => {
  const token = getToken();
  const response = await axios.delete(`${API_URL}/events/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const createVenue = async (venueData) => {
  const token = getToken();
  const response = await axios.post(`${API_URL}/venues`, venueData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const updateVenue = async (id, venueData) => {
  const token = getToken();
  const response = await axios.put(`${API_URL}/venues/${id}`, venueData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const deleteVenue = async (id) => {
    const token = getToken();
    const response = await axios.delete(`${API_URL}/venues/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  };
  
  export const bookEvent = async (userId, eventId) => {
    const token = getToken();
    const response = await axios.post(`${API_URL}/bookings/book`, { userId, eventId }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  };
  
  export const cancelBooking = async (userId, eventId) => {
    const token = getToken();
    const response = await axios.post(`${API_URL}/bookings/cancel`, { userId, eventId }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  };
  
  export const getUserBookings = async (userId) => {
    const token = getToken();
    const response = await axios.get(`${API_URL}/bookings/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  };

  export const getUserChatGroups = async (userId) => {
    const token = getToken();
    const response = await axios.get(`${API_URL}/chat/user-groups/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  };
  
  export const getChatMessages = async (groupId) => {
    const token = getToken();
    const response = await axios.get(`${API_URL}/chat/messages/${groupId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  };
  
  export const sendMessage = async (groupId, userId, message) => {
    const token = getToken();
    const response = await axios.post(`${API_URL}/chat/send`, {
      groupId,  // Change this from chatGroupId to groupId
      userId,
      message
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  };
  

  export const getUserProfile = async (userId) => {
    const token = getToken(); 
    const response = await axios.get(`${API_URL}/profile/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };
  
  export const updateUserProfile = async (userId, profileData) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/profile/${userId}`, profileData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };

export const getRecommendations = async (userId) => {
  const response = await axios.get(`${API_URL}/recommendations?userId=${userId}`);
  return response.data;
};

export const getEventReviews = async (eventId) => {
  const response = await axios.get(`${API_URL}/events/${eventId}/reviews`);
  return response.data;
};

export const addReview = async ({ eventId, userId, rating, review }) => {
  const token = localStorage.getItem('token');
  return await axios.post(`${API_URL}/events/${eventId}/reviews`, {
    userId,
    rating,
    review,
  }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const getAverageRating = async (eventId) => {
  const response = await axios.get(`${API_URL}/events/${eventId}/average-rating`);
  return response.data;
};

