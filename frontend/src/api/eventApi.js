import axios from "./axios";

const API_URL = "http://localhost:8070/api/events";

export const eventApi = {
  // Get all events
  getAllEvents: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  // Get single event
  getEvent: async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  // Create event (admin/staff/manager only)
  createEvent: async (eventData) => {
    const response = await axios.post(API_URL, eventData);
    return response.data;
  },

  // Update event
  updateEvent: async (id, eventData) => {
    const response = await axios.put(`${API_URL}/${id}`, eventData);
    return response.data;
  },

  // Delete event
  deleteEvent: async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  }
};

export default eventApi;
