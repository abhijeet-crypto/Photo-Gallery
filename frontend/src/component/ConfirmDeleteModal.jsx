
import React from "react";

function ConfirmDeleteModal({ onClose, onConfirm, count }) {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center">
      <div className="bg-[#1E1E1E] p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-2 text-white">Delete Photos</h2>
        <p className="text-gray-300 mb-4">
          Are you sure you want to delete {count} selected photo{count > 1 ? "s" : ""}?
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500 text-white"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDeleteModal;
