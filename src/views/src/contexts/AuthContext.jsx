import { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/authService";

// Context lưu trạng thái đăng nhập toàn app
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Kiểm tra token khi app khởi động
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Đăng nhập
  const login = async (username, password) => {
    const data = await authService.login(username, password);
    localStorage.setItem("access_token", data.access_token);

    // Lấy thông tin user
    const userInfo = await authService.getMe();
    localStorage.setItem("user", JSON.stringify(userInfo));
    setUser(userInfo);

    return userInfo;
  };

  // Đăng xuất
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    setUser(null);
  };

  // Kiểm tra có phải admin không
  const isAdmin = () => {
    return user?.role === "ADMIN";
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAdmin,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Hook để sử dụng auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
