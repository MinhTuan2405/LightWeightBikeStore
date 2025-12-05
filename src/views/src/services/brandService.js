import api from "./api";

// Service quản lý thương hiệu
const brandService = {
  async getAll() {
    const response = await api.get("/brands");
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/brands/${id}`);
    return response.data;
  },

  async create(data) {
    const response = await api.post("/brands", data);
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(`/brands/${id}`, data);
    return response.data;
  },

  async delete(id) {
    await api.delete(`/brands/${id}`);
  },
};

export default brandService;
