import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  FiHome,
  FiPackage,
  FiShoppingCart,
  FiUsers,
  FiUserCheck,
  FiTag,
  FiGrid,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { useState } from "react";

// Layout chính với Sidebar và Header
function Layout() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Menu items
  const menuItems = [
    { path: "/dashboard", icon: FiHome, label: "Tổng quan" },
    { path: "/products", icon: FiPackage, label: "Sản phẩm" },
    { path: "/orders", icon: FiShoppingCart, label: "Đơn hàng" },
    { path: "/customers", icon: FiUsers, label: "Khách hàng" },
    { path: "/brands", icon: FiTag, label: "Thương hiệu" },
    { path: "/categories", icon: FiGrid, label: "Danh mục" },
  ];

  // Thêm menu Nhân viên nếu là Admin
  if (isAdmin()) {
    menuItems.push({ path: "/staffs", icon: FiUserCheck, label: "Nhân viên" });
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-primary-800 text-white transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 bg-primary-900">
          <h1 className="text-xl font-bold">🚴 Bike Store</h1>
          <button
            className="lg:hidden text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `
                flex items-center px-4 py-3 mb-1 rounded-lg transition-colors
                ${
                  isActive
                    ? "bg-primary-700 text-white"
                    : "text-primary-200 hover:bg-primary-700 hover:text-white"
                }
              `}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User info & Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-primary-700">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="ml-3">
              <p className="font-medium">{user?.username}</p>
              <p className="text-xs text-primary-300">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-primary-200 hover:bg-primary-700 rounded-lg transition-colors"
          >
            <FiLogOut className="w-5 h-5 mr-3" />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6">
          <button
            className="lg:hidden text-gray-600"
            onClick={() => setSidebarOpen(true)}
          >
            <FiMenu size={24} />
          </button>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              Xin chào,{" "}
              <span className="font-medium text-gray-700">
                {user?.first_name || user?.username}
              </span>
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
