import api from "./api";

// Service quản lý khách hàng
const customerService = {
  async getAll(params = {}) {
    const response = await api.get("/customers", { params });
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/customers/${id}`);
    return response.data;
  },

  async create(data) {
    const response = await api.post("/customers", data);
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(`/customers/${id}`, data);
    return response.data;
  },

  async delete(id) {
    await api.delete(`/customers/${id}`);
  },
};

export default customerService;
