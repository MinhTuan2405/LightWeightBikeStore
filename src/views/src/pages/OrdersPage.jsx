import { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiEye } from "react-icons/fi";
import orderService from "../services/orderService";
import customerService from "../services/customerService";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import Modal from "../components/Modal";
import ConfirmDelete from "../components/ConfirmDelete";
import toast from "react-hot-toast";

function OrdersPage() {
  const { isAdmin } = useAuth();
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Trạng thái đơn hàng
  const statusMap = {
    1: { label: "Chờ xử lý", color: "bg-yellow-100 text-yellow-800" },
    2: { label: "Đang giao", color: "bg-blue-100 text-blue-800" },
    3: { label: "Hoàn thành", color: "bg-green-100 text-green-800" },
    4: { label: "Đã hủy", color: "bg-red-100 text-red-800" },
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [ordersData, customersData] = await Promise.all([
        orderService.getAll(),
        customerService.getAll(),
      ]);
      setOrders(ordersData);
      setCustomers(customersData);
    } catch (error) {
      toast.error("Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  // Lấy tên khách hàng
  const getCustomerName = (id) => {
    const customer = customers.find((c) => c.customer_id === id);
    return customer ? `${customer.first_name} ${customer.last_name}` : "-";
  };

  // Cập nhật trạng thái
  const updateStatus = async (orderId, newStatus) => {
    try {
      await orderService.updateStatus(orderId, newStatus);
      toast.success("Cập nhật trạng thái thành công");
      loadData();
    } catch (error) {
      toast.error("Không thể cập nhật trạng thái");
    }
  };

  // Xóa đơn hàng
  const handleDelete = async () => {
    try {
      await orderService.delete(selectedOrder.order_id);
      toast.success("Xóa đơn hàng thành công");
      setIsDeleteOpen(false);
      loadData();
    } catch (error) {
      toast.error("Không thể xóa đơn hàng");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Đơn hàng</h1>
        <p className="text-gray-500">Quản lý và theo dõi các đơn đặt hàng</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(statusMap).map(([status, { label, color }]) => {
          const count = orders.filter(
            (o) => o.order_status === parseInt(status)
          ).length;
          return (
            <div key={status} className="bg-white rounded-xl shadow-sm p-4">
              <span
                className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${color}`}
              >
                {label}
              </span>
              <p className="text-2xl font-bold mt-2">{count}</p>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="table-header">
                <th className="px-6 py-3">Mã đơn</th>
                <th className="px-6 py-3">Khách hàng</th>
                <th className="px-6 py-3">Ngày đặt</th>
                <th className="px-6 py-3">Trạng thái</th>
                <th className="px-6 py-3">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.order_id} className="table-row">
                  <td className="px-6 py-4 font-medium">#{order.order_id}</td>
                  <td className="px-6 py-4">
                    {getCustomerName(order.customer_id)}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(order.order_date).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-6 py-4">
                    {isAdmin() ? (
                      <select
                        value={order.order_status}
                        onChange={(e) =>
                          updateStatus(order.order_id, parseInt(e.target.value))
                        }
                        className={`px-2 py-1 rounded-full text-xs font-medium border-0 cursor-pointer
                          ${statusMap[order.order_status]?.color}`}
                      >
                        {Object.entries(statusMap).map(([val, { label }]) => (
                          <option key={val} value={val}>
                            {label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium
                        ${statusMap[order.order_status]?.color}`}
                      >
                        {statusMap[order.order_status]?.label}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsDetailOpen(true);
                        }}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        title="Xem chi tiết"
                      >
                        <FiEye size={18} />
                      </button>
                      {isAdmin() && (
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setIsDeleteOpen(true);
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Xóa"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Chưa có đơn hàng nào
            </div>
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title={`Chi tiết đơn hàng #${selectedOrder?.order_id}`}
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Khách hàng</p>
                <p className="font-medium">
                  {getCustomerName(selectedOrder.customer_id)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ngày đặt</p>
                <p className="font-medium">
                  {new Date(selectedOrder.order_date).toLocaleDateString(
                    "vi-VN"
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Trạng thái</p>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium
                  ${statusMap[selectedOrder.order_status]?.color}`}
                >
                  {statusMap[selectedOrder.order_status]?.label}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Nhân viên xử lý</p>
                <p className="font-medium">{selectedOrder.staff_id || "-"}</p>
              </div>
            </div>

            {/* Order items would go here if available */}
            <div className="border-t pt-4">
              <p className="text-sm text-gray-500 mb-2">Ghi chú</p>
              <p className="text-gray-700">
                {selectedOrder.notes || "Không có ghi chú"}
              </p>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDelete
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        itemName={`Đơn hàng #${selectedOrder?.order_id}`}
      />
    </div>
  );
}

export default OrdersPage;
