import { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";
import productService from "../services/productService";
import brandService from "../services/brandService";
import categoryService from "../services/categoryService";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import Modal from "../components/Modal";
import ConfirmDelete from "../components/ConfirmDelete";
import toast from "react-hot-toast";

function ProductsPage() {
  const { isAdmin } = useAuth();
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    product_name: "",
    brand_id: "",
    category_id: "",
    model_year: new Date().getFullYear(),
    list_price: "",
    stock: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsData, brandsData, categoriesData] = await Promise.all([
        productService.getAll(),
        brandService.getAll(),
        categoryService.getAll(),
      ]);
      setProducts(productsData);
      setBrands(brandsData);
      setCategories(categoriesData);
    } catch (error) {
      toast.error("Không thể tải dữ liệu");
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

  // Lấy tên brand/category từ ID
  const getBrandName = (id) =>
    brands.find((b) => b.brand_id === id)?.brand_name || "-";
  const getCategoryName = (id) =>
    categories.find((c) => c.category_id === id)?.category_name || "-";

  // Mở modal tạo mới
  const openCreateModal = () => {
    setSelectedProduct(null);
    setFormData({
      product_name: "",
      brand_id: brands[0]?.brand_id || "",
      category_id: categories[0]?.category_id || "",
      model_year: new Date().getFullYear(),
      list_price: "",
      stock: 0,
    });
    setIsModalOpen(true);
  };

  // Mở modal chỉnh sửa
  const openEditModal = (product) => {
    setSelectedProduct(product);
    setFormData({
      product_name: product.product_name,
      brand_id: product.brand_id,
      category_id: product.category_id,
      model_year: product.model_year,
      list_price: product.list_price,
      stock: product.stock || 0,
    });
    setIsModalOpen(true);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedProduct) {
        await productService.update(selectedProduct.product_id, formData);
        toast.success("Cập nhật sản phẩm thành công");
      } else {
        await productService.create(formData);
        toast.success("Tạo sản phẩm thành công");
      }
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Có lỗi xảy ra");
    }
  };

  // Xóa sản phẩm
  const handleDelete = async () => {
    try {
      await productService.delete(selectedProduct.product_id);
      toast.success("Xóa sản phẩm thành công");
      setIsDeleteOpen(false);
      loadData();
    } catch (error) {
      toast.error("Không thể xóa sản phẩm");
    }
  };

  // Lọc sản phẩm theo search
  const filteredProducts = products.filter((p) =>
    p.product_name.toLowerCase().includes(search.toLowerCase())
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Sản phẩm</h1>
          <p className="text-gray-500">Quản lý danh sách xe đạp và phụ kiện</p>
        </div>
        {isAdmin() && (
          <button
            onClick={openCreateModal}
            className="btn-primary flex items-center"
          >
            <FiPlus className="mr-2" /> Thêm sản phẩm
          </button>
        )}
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="input-group max-w-md">
          <div className="input-group-icon">
            <FiSearch size={20} />
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-group-field"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="table-header">
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Tên sản phẩm</th>
                <th className="px-6 py-3">Thương hiệu</th>
                <th className="px-6 py-3">Danh mục</th>
                <th className="px-6 py-3">Năm SX</th>
                <th className="px-6 py-3">Giá</th>
                <th className="px-6 py-3">Tồn kho</th>
                {isAdmin() && <th className="px-6 py-3">Thao tác</th>}
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.product_id} className="table-row">
                  <td className="px-6 py-4 font-medium">
                    {product.product_id}
                  </td>
                  <td className="px-6 py-4">{product.product_name}</td>
                  <td className="px-6 py-4">
                    {getBrandName(product.brand_id)}
                  </td>
                  <td className="px-6 py-4">
                    {getCategoryName(product.category_id)}
                  </td>
                  <td className="px-6 py-4">{product.model_year}</td>
                  <td className="px-6 py-4 font-medium text-primary-600">
                    {formatCurrency(product.list_price)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium
                      ${
                        product.stock > 10
                          ? "bg-green-100 text-green-800"
                          : product.stock > 0
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }
                    `}
                    >
                      {product.stock || 0}
                    </span>
                  </td>
                  {isAdmin() && (
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setIsDeleteOpen(true);
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {filteredProducts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Không tìm thấy sản phẩm nào
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedProduct ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên sản phẩm
            </label>
            <input
              type="text"
              value={formData.product_name}
              onChange={(e) =>
                setFormData({ ...formData, product_name: e.target.value })
              }
              className="input-field"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thương hiệu
              </label>
              <select
                value={formData.brand_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    brand_id: parseInt(e.target.value),
                  })
                }
                className="input-field"
                required
              >
                {brands.map((b) => (
                  <option key={b.brand_id} value={b.brand_id}>
                    {b.brand_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Danh mục
              </label>
              <select
                value={formData.category_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category_id: parseInt(e.target.value),
                  })
                }
                className="input-field"
                required
              >
                {categories.map((c) => (
                  <option key={c.category_id} value={c.category_id}>
                    {c.category_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Năm SX
              </label>
              <input
                type="number"
                value={formData.model_year}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    model_year: parseInt(e.target.value),
                  })
                }
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giá (VNĐ)
              </label>
              <input
                type="number"
                value={formData.list_price}
                onChange={(e) =>
                  setFormData({ ...formData, list_price: e.target.value })
                }
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tồn kho
              </label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: parseInt(e.target.value) })
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
              {selectedProduct ? "Cập nhật" : "Tạo mới"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDelete
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        itemName={selectedProduct?.product_name}
      />
    </div>
  );
}

export default ProductsPage;
