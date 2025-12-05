import { useState, useEffect } from "react";
import {
  FiPackage,
  FiShoppingCart,
  FiUsers,
  FiDollarSign,
  FiTrendingUp,
} from "react-icons/fi";
import statisticsService from "../services/statisticsService";
import productService from "../services/productService";
import orderService from "../services/orderService";
import LoadingSpinner from "../components/LoadingSpinner";

function DashboardPage() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load data đồng thời
      const [products, orders] = await Promise.all([
        productService.getAll({ limit: 1000 }),
        orderService.getAll({ limit: 10 }),
      ]);

      // Tính toán stats
      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalCustomers: new Set(orders.map((o) => o.customer_id)).size,
        totalRevenue: orders.reduce((sum, o) => sum + (o.total_amount || 0), 0),
      });

      setRecentOrders(orders.slice(0, 5));
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  // Format tiền VNĐ
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const statCards = [
    {
      label: "Sản phẩm",
      value: stats.totalProducts,
      icon: FiPackage,
      color: "bg-blue-500",
    },
    {
      label: "Đơn hàng",
      value: stats.totalOrders,
      icon: FiShoppingCart,
      color: "bg-green-500",
    },
    {
      label: "Khách hàng",
      value: stats.totalCustomers,
      icon: FiUsers,
      color: "bg-purple-500",
    },
    {
      label: "Doanh thu",
      value: formatCurrency(stats.totalRevenue),
      icon: FiDollarSign,
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Tổng quan</h1>
        <p className="text-gray-500">
          Chào mừng đến với hệ thống quản lý cửa hàng xe đạp
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm p-6 card-hover"
          >
            <div className="flex items-center">
              <div className={`${card.color} p-3 rounded-lg text-white`}>
                <card.icon size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="text-xl font-bold text-gray-800">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <FiTrendingUp className="mr-2 text-primary-600" />
            Đơn hàng gần đây
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="table-header">
                <th className="px-6 py-3">Mã đơn</th>
                <th className="px-6 py-3">Khách hàng</th>
                <th className="px-6 py-3">Ngày đặt</th>
                <th className="px-6 py-3">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <tr key={order.order_id} className="table-row">
                    <td className="px-6 py-4 font-medium">#{order.order_id}</td>
                    <td className="px-6 py-4">{order.customer_id}</td>
                    <td className="px-6 py-4">
                      {new Date(order.order_date).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium
                        ${
                          order.order_status === 1
                            ? "bg-yellow-100 text-yellow-800"
                            : order.order_status === 2
                            ? "bg-blue-100 text-blue-800"
                            : order.order_status === 3
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }
                      `}
                      >
                        {order.order_status === 1
                          ? "Chờ xử lý"
                          : order.order_status === 2
                          ? "Đang giao"
                          : order.order_status === 3
                          ? "Hoàn thành"
                          : "Đã hủy"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Chưa có đơn hàng nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
