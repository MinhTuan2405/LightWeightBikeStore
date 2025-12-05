import api from "./api";

// Service xử lý đăng nhập/đăng ký
const authService = {
  // Đăng nhập
  async login(username, password) {
    const response = await api.post("/auth/login", { username, password });
    return response.data;
  },

  // Đăng ký
  async register(data) {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  // Lấy thông tin user hiện tại
  async getMe() {
    const response = await api.get("/auth/me");
    return response.data;
  },
};

export default authService;
