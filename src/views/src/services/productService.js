import api from "./api";

// Service quản lý sản phẩm
const productService = {
  // Lấy danh sách sản phẩm
  async getAll(params = {}) {
    const response = await api.get("/products", { params });
    return response.data;
  },

  // Lấy chi tiết sản phẩm
  async getById(id) {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Tạo sản phẩm mới (Admin)
  async create(data) {
    const response = await api.post("/products", data);
    return response.data;
  },

  // Cập nhật sản phẩm (Admin)
  async update(id, data) {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },

  // Xóa sản phẩm (Admin)
  async delete(id) {
    await api.delete(`/products/${id}`);
  },
};

export default productService;
