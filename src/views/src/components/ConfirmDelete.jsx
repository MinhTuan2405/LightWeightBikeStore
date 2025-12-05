import { FiAlertTriangle } from "react-icons/fi";
import Modal from "./Modal";

// Component xác nhận xóa
function ConfirmDelete({ isOpen, onClose, onConfirm, itemName }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Xác nhận xóa" size="sm">
      <div className="text-center">
        <FiAlertTriangle className="mx-auto text-red-500 w-12 h-12 mb-4" />
        <p className="text-gray-600 mb-6">
          Bạn có chắc chắn muốn xóa <strong>{itemName}</strong>?
          <br />
          <span className="text-sm text-gray-500">
            Hành động này không thể hoàn tác.
          </span>
        </p>
        <div className="flex justify-center space-x-3">
          <button onClick={onClose} className="btn-secondary">
            Hủy
          </button>
          <button onClick={onConfirm} className="btn-danger">
            Xóa
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmDelete;
