import api from "./api";

// Service quản lý đơn hàng
const orderService = {
  // Lấy danh sách đơn hàng
  async getAll(params = {}) {
    const response = await api.get("/orders", { params });
    return response.data;
  },

  // Lấy chi tiết đơn hàng
  async getById(id) {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // Tạo đơn hàng mới
  async create(data) {
    const response = await api.post("/orders", data);
    return response.data;
  },

  // Cập nhật trạng thái đơn hàng
  async updateStatus(id, status) {
    const response = await api.put(`/orders/${id}`, { order_status: status });
    return response.data;
  },

  // Xóa đơn hàng
  async delete(id) {
    await api.delete(`/orders/${id}`);
  },
};

export default orderService;
