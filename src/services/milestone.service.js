import api from "../lib/axios";

export const milestoneService = {
  getAll: async (params = {}) => {
    const { data } = await api.get("/milestones", { params });
    return data; 
  },

  getById: async (id) => {
    const { data } = await api.get(`/milestones/${id}`);
    return data.data;
  },

  create: async (milestoneData) => {
    const { data } = await api.post("/milestones", milestoneData);
    return data.data;
  },

  update: async (id, milestoneData) => {
    const { data } = await api.patch(`/milestones/${id}`, milestoneData);
    return data.data;
  },

  remove: async (id) => {
    await api.delete(`/milestones/${id}`);
  },
};