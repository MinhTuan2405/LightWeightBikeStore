import { useState, useEffect } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiUserCheck,
  FiUserX,
} from "react-icons/fi";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import Modal from "../components/Modal";
import ConfirmDelete from "../components/ConfirmDelete";
import toast from "react-hot-toast";
import api from "../services/api";

function StaffsPage() {
  const { isAdmin, user } = useAuth();
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone: "",
    role: "STAFF",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await api.get("/staffs");
      setStaffs(response.data);
    } catch (error) {
      toast.error("Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setSelectedStaff(null);
    setFormData({
      username: "",
      email: "",
      password: "",
      first_name: "",
      last_name: "",
      phone: "",
      role: "STAFF",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (staff) => {
    setSelectedStaff(staff);
    setFormData({
      username: staff.username,
      email: staff.email,
      password: "",
      first_name: staff.first_name || "",
      last_name: staff.last_name || "",
      phone: staff.phone || "",
      role: staff.role,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedStaff) {
        const updateData = { ...formData };
        if (!updateData.password) delete updateData.password;
        await api.put(`/staffs/${selectedStaff.staff_id}`, updateData);
        toast.success("Cập nhật nhân viên thành công");
      } else {
        await api.post("/auth/register", formData);
        toast.success("Thêm nhân viên thành công");
      }
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Có lỗi xảy ra");
    }
  };

  const toggleActive = async (staff) => {
    try {
      await api.put(`/staffs/${staff.staff_id}`, {
        is_active: !staff.is_active,
      });
      toast.success(staff.is_active ? "Đã vô hiệu hóa" : "Đã kích hoạt");
      loadData();
    } catch (error) {
      toast.error("Không thể cập nhật");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/staffs/${selectedStaff.staff_id}`);
      toast.success("Xóa nhân viên thành công");
      setIsDeleteOpen(false);
      loadData();
    } catch (error) {
      toast.error("Không thể xóa nhân viên");
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Nhân viên</h1>
          <p className="text-gray-500">Quản lý tài khoản nhân viên hệ thống</p>
        </div>
        <button
          onClick={openCreateModal}
          className="btn-primary flex items-center"
        >
          <FiPlus className="mr-2" /> Thêm nhân viên
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="table-header">
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Username</th>
                <th className="px-6 py-3">Họ tên</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Vai trò</th>
                <th className="px-6 py-3">Trạng thái</th>
                <th className="px-6 py-3">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {staffs.map((staff) => (
                <tr key={staff.staff_id} className="table-row">
                  <td className="px-6 py-4 font-medium">{staff.staff_id}</td>
                  <td className="px-6 py-4">{staff.username}</td>
                  <td className="px-6 py-4">
                    {staff.first_name} {staff.last_name}
                  </td>
                  <td className="px-6 py-4">{staff.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium
                      ${
                        staff.role === "ADMIN"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800"
                      }
                    `}
                    >
                      {staff.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium
                      ${
                        staff.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }
                    `}
                    >
                      {staff.is_active ? "Hoạt động" : "Vô hiệu"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => toggleActive(staff)}
                        className={`p-2 rounded-lg ${
                          staff.is_active
                            ? "text-red-600 hover:bg-red-50"
                            : "text-green-600 hover:bg-green-50"
                        }`}
                        title={staff.is_active ? "Vô hiệu hóa" : "Kích hoạt"}
                      >
                        {staff.is_active ? (
                          <FiUserX size={18} />
                        ) : (
                          <FiUserCheck size={18} />
                        )}
                      </button>
                      <button
                        onClick={() => openEditModal(staff)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <FiEdit2 size={18} />
                      </button>
                      {staff.staff_id !== user?.staff_id && (
                        <button
                          onClick={() => {
                            setSelectedStaff(staff);
                            setIsDeleteOpen(true);
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
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
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedStaff ? "Cập nhật nhân viên" : "Thêm nhân viên"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="input-field"
                required
                disabled={!!selectedStaff}
              />
            </div>
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
          </div>
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
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {selectedStaff
                  ? "Mật khẩu mới (bỏ trống nếu không đổi)"
                  : "Mật khẩu"}
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="input-field"
                required={!selectedStaff}
                minLength={8}
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
              Vai trò
            </label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="input-field"
            >
              <option value="STAFF">STAFF</option>
              <option value="ADMIN">ADMIN</option>
            </select>
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
              {selectedStaff ? "Cập nhật" : "Thêm"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDelete
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        itemName={selectedStaff?.username}
      />
    </div>
  );
}

export default StaffsPage;
