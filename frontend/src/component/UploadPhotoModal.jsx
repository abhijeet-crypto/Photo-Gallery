import React, { useState } from "react";

function UploadPhotoModal({ url, albumId, onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ url, albumId, title, description, tags });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-center items-center">
      <div className="bg-[#1e1e1e] rounded-lg shadow-lg p-6 w-[90%] max-w-md">
        <h2 className="text-xl font-bold text-white mb-4">Add Photo Details</h2>
        <img src={url} alt="Preview" className="w-full h-48 object-cover rounded mb-4" />
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-700 bg-[#2b2b2b] text-white rounded-md px-3 py-2 mb-3"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-700 bg-[#2b2b2b] text-white rounded-md px-3 py-2 mb-3"
          />
          <input
            type="text"
            placeholder="Tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
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
              Save Photo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UploadPhotoModal;
