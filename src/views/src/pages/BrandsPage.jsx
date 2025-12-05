import { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiTag } from "react-icons/fi";
import brandService from "../services/brandService";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import Modal from "../components/Modal";
import ConfirmDelete from "../components/ConfirmDelete";
import toast from "react-hot-toast";

function BrandsPage() {
  const { isAdmin } = useAuth();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [brandName, setBrandName] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await brandService.getAll();
      setBrands(data);
    } catch (error) {
      toast.error("Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setSelectedBrand(null);
    setBrandName("");
    setIsModalOpen(true);
  };

  const openEditModal = (brand) => {
    setSelectedBrand(brand);
    setBrandName(brand.brand_name);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedBrand) {
        await brandService.update(selectedBrand.brand_id, {
          brand_name: brandName,
        });
        toast.success("Cập nhật thương hiệu thành công");
      } else {
        await brandService.create({ brand_name: brandName });
        toast.success("Thêm thương hiệu thành công");
      }
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Có lỗi xảy ra");
    }
  };

  const handleDelete = async () => {
    try {
      await brandService.delete(selectedBrand.brand_id);
      toast.success("Xóa thương hiệu thành công");
      setIsDeleteOpen(false);
      loadData();
    } catch (error) {
      toast.error("Không thể xóa thương hiệu");
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
          <h1 className="text-2xl font-bold text-gray-800">Thương hiệu</h1>
          <p className="text-gray-500">Quản lý các thương hiệu xe đạp</p>
        </div>
        {isAdmin() && (
          <button
            onClick={openCreateModal}
            className="btn-primary flex items-center"
          >
            <FiPlus className="mr-2" /> Thêm thương hiệu
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {brands.map((brand) => (
          <div
            key={brand.brand_id}
            className="bg-white rounded-xl shadow-sm p-5 card-hover"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-lg bg-accent-100 flex items-center justify-center">
                  <FiTag className="text-accent-600" size={24} />
                </div>
                <div className="ml-3">
                  <h3 className="font-semibold text-gray-800">
                    {brand.brand_name}
                  </h3>
                  <p className="text-sm text-gray-500">ID: {brand.brand_id}</p>
                </div>
              </div>
              {isAdmin() && (
                <div className="flex space-x-1">
                  <button
                    onClick={() => openEditModal(brand)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <FiEdit2 size={16} />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedBrand(brand);
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

      {brands.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Chưa có thương hiệu nào
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedBrand ? "Cập nhật thương hiệu" : "Thêm thương hiệu"}
        size="sm"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên thương hiệu
            </label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="input-field"
              placeholder="VD: Giant, Trek, Specialized..."
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
              {selectedBrand ? "Cập nhật" : "Thêm"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDelete
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        itemName={selectedBrand?.brand_name}
      />
    </div>
  );
}

export default BrandsPage;
