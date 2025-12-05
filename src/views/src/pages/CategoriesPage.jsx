import { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiGrid } from "react-icons/fi";
import categoryService from "../services/categoryService";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import Modal from "../components/Modal";
import ConfirmDelete from "../components/ConfirmDelete";
import toast from "react-hot-toast";

function CategoriesPage() {
  const { isAdmin } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      toast.error("Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setSelectedCategory(null);
    setCategoryName("");
    setIsModalOpen(true);
  };

  const openEditModal = (category) => {
    setSelectedCategory(category);
    setCategoryName(category.category_name);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedCategory) {
        await categoryService.update(selectedCategory.category_id, {
          category_name: categoryName,
        });
        toast.success("Cập nhật danh mục thành công");
      } else {
        await categoryService.create({ category_name: categoryName });
        toast.success("Thêm danh mục thành công");
      }
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Có lỗi xảy ra");
    }
  };

  const handleDelete = async () => {
    try {
      await categoryService.delete(selectedCategory.category_id);
      toast.success("Xóa danh mục thành công");
      setIsDeleteOpen(false);
      loadData();
    } catch (error) {
      toast.error("Không thể xóa danh mục");
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
          <h1 className="text-2xl font-bold text-gray-800">Danh mục</h1>
          <p className="text-gray-500">Quản lý các danh mục sản phẩm</p>
        </div>
        {isAdmin() && (
          <button
            onClick={openCreateModal}
            className="btn-primary flex items-center"
          >
            <FiPlus className="mr-2" /> Thêm danh mục
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categories.map((category) => (
          <div
            key={category.category_id}
            className="bg-white rounded-xl shadow-sm p-5 card-hover"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
                  <FiGrid className="text-primary-600" size={24} />
                </div>
                <div className="ml-3">
                  <h3 className="font-semibold text-gray-800">
                    {category.category_name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    ID: {category.category_id}
                  </p>
                </div>
              </div>
              {isAdmin() && (
                <div className="flex space-x-1">
                  <button
                    onClick={() => openEditModal(category)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <FiEdit2 size={16} />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCategory(category);
                      setIsDeleteOpen(true);
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Chưa có danh mục nào
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedCategory ? "Cập nhật danh mục" : "Thêm danh mục"}
        size="sm"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên danh mục
            </label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="input-field"
              placeholder="VD: Xe đạp đường trường, Xe địa hình..."
              required
            />
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
              {selectedCategory ? "Cập nhật" : "Thêm"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDelete
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        itemName={selectedCategory?.category_name}
      />
    </div>
  );
}

export default CategoriesPage;
