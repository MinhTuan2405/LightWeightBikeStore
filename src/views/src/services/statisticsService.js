import api from "./api";

// Service thống kê
const statisticsService = {
  // Thống kê tổng quan
  async getOverview() {
    const response = await api.get("/statistics/overview");
    return response.data;
  },

  // Doanh thu theo tháng
  async getRevenue(params = {}) {
    const response = await api.get("/statistics/revenue", { params });
    return response.data;
  },

  // Top sản phẩm bán chạy
  async getTopProducts(limit = 10) {
    const response = await api.get("/statistics/top-products", {
      params: { limit },
    });
    return response.data;
  },
};

export default statisticsService;
