import { useState, useEffect } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiPhone,
  FiMail,
} from "react-icons/fi";
import customerService from "../services/customerService";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import Modal from "../components/Modal";
import ConfirmDelete from "../components/ConfirmDelete";
import toast from "react-hot-toast";

function CustomersPage() {
  const { isAdmin } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip_code: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await customerService.getAll();
      setCustomers(data);
    } catch (error) {
      toast.error("Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setSelectedCustomer(null);
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      zip_code: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (customer) => {
    setSelectedCustomer(customer);
    setFormData({
      first_name: customer.first_name || "",
      last_name: customer.last_name || "",
      email: customer.email || "",
      phone: customer.phone || "",
      street: customer.street || "",
      city: customer.city || "",
      state: customer.state || "",
      zip_code: customer.zip_code || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedCustomer) {
        await customerService.update(selectedCustomer.customer_id, formData);
        toast.success("Cập nhật khách hàng thành công");
      } else {
        await customerService.create(formData);
        toast.success("Thêm khách hàng thành công");
      }
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Có lỗi xảy ra");
    }
  };

  const handleDelete = async () => {
    try {
      await customerService.delete(selectedCustomer.customer_id);
      toast.success("Xóa khách hàng thành công");
      setIsDeleteOpen(false);
      loadData();
    } catch (error) {
      toast.error("Không thể xóa khách hàng");
    }
  };

  const filteredCustomers = customers.filter(
    (c) =>
      `${c.first_name} ${c.last_name}`
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Khách hàng</h1>
          <p className="text-gray-500">Quản lý thông tin khách hàng</p>
        </div>
        {isAdmin() && (
          <button
            onClick={openCreateModal}
            className="btn-primary flex items-center"
          >
            <FiPlus className="mr-2" /> Thêm khách hàng
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="input-group max-w-md">
          <div className="input-group-icon">
            <FiSearch size={20} />
          </div>
          <input
            type="text"
            placeholder="Tìm theo tên hoặc email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-group-field"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((customer) => (
          <div
            key={customer.customer_id}
            className="bg-white rounded-xl shadow-sm p-5 card-hover"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
                  {customer.first_name?.charAt(0)}
                  {customer.last_name?.charAt(0)}
                </div>
                <div className="ml-3">
                  <h3 className="font-semibold text-gray-800">
                    {customer.first_name} {customer.last_name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    ID: {customer.customer_id}
                  </p>
                </div>
              </div>
              {isAdmin() && (
                <div className="flex space-x-1">
                  <button
                    onClick={() => openEditModal(customer)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <FiEdit2 size={16} />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCustomer(customer);
                      setIsDeleteOpen(true);
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              )}
            </div>
            <div className="mt-4 space-y-2">
              {customer.email && (
                <p className="text-sm text-gray-600 flex items-center">
                  <FiMail className="mr-2 text-gray-400" /> {customer.email}
                </p>
              )}
              {customer.phone && (
                <p className="text-sm text-gray-600 flex items-center">
                  <FiPhone className="mr-2 text-gray-400" /> {customer.phone}
                </p>
              )}
              {customer.city && (
                <p className="text-sm text-gray-500">
                  📍 {customer.street}, {customer.city}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Không tìm thấy khách hàng nào
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedCustomer ? "Cập nhật khách hàng" : "Thêm khách hàng"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Họ
              </label>
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) =>
                  setFormData({ ...formData, last_name: e.target.value })
                }
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên
              </label>
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) =>
                  setFormData({ ...formData, first_name: e.target.value })
                }
                className="input-field"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Điện thoại
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="input-field"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Địa chỉ
            </label>
            <input
              type="text"
              value={formData.street}
              onChange={(e) =>
                setFormData({ ...formData, street: e.target.value })
              }
              className="input-field"
              placeholder="Số nhà, đường"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thành phố
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tỉnh/Bang
              </label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) =>
                  setFormData({ ...formData, state: e.target.value })
                }
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mã bưu chính
              </label>
              <input
                type="text"
                value={formData.zip_code}
                onChange={(e) =>
                  setFormData({ ...formData, zip_code: e.target.value })
                }
                className="input-field"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn-secondary"
            >
              Hủy
            </button>
            <button type="submit" className="btn-primary">
              {selectedCustomer ? "Cập nhật" : "Thêm"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDelete
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        itemName={`${selectedCustomer?.first_name} ${selectedCustomer?.last_name}`}
      />
    </div>
  );
}

export default CustomersPage;
