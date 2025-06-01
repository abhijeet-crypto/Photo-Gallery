import React, { useState } from "react";

function EditPhotoModal({ photo, onClose, onSave }) {
  const [title, setTitle] = useState(photo.title || "");
  const [description, setDescription] = useState(photo.description || "");
  const [tags, setTags] = useState(photo.tags || "");
  const [favourite, setFavourite] = useState(photo.isFav || false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...photo,
      title,
      description,
      tags: tags,
      favourite,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center items-start pt-24">
      <div className="bg-[#1e1e1e] text-white rounded-lg shadow-lg p-6 w-[90%] max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Photo</h2>
        <img
          src={photo.url}
          alt="Preview"
          className="w-full h-48 object-cover rounded mb-4"
        />
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full bg-[#2b2b2b] border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="w-full bg-[#2b2b2b] border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400"
          ></textarea>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tags (comma separated)"
            className="w-full bg-[#2b2b2b] border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400"
          />
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={favourite}
              onChange={(e) => setFavourite(e.target.checked)}
              className="form-checkbox h-4 w-4 text-blue-600"
            />
            <span>Mark as Favourite</span>
          </label>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPhotoModal;
