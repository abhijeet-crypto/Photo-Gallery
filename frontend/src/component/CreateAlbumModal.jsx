import React from "react";

function CreateAlbumModal({ onClose, onSubmit }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const name = e.target.albumName.value.trim();
    if (name) onSubmit(name);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-center items-center">
      <div className="bg-[#1e1e1e] rounded-lg shadow-lg p-6 w-[90%] max-w-md">
        <h2 className="text-xl font-bold text-white mb-4">Create New Album</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="albumName"
            placeholder="Album name"
            className="w-full border border-gray-700 bg-[#2b2b2b] text-white rounded-md px-3 py-2 mb-4"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateAlbumModal;
