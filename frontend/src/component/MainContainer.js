import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ChevronDown,
  ChevronRight,
  Image as ImageIcon,
  Plus,
} from "lucide-react";
import CreateAlbumModal from "./CreateAlbumModal";
import UploadPhotoModal from "./UploadPhotoModal";
import EditPhotoModal from "./EditPhotoModal";
import { Trash2 } from "lucide-react";
import { Check } from "lucide-react";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

function groupPhotosByMonth(photos) {
  const groups = {};
  photos.forEach((photo) => {
    const dateObj = new Date(photo.createdAt);
    const monthKey = dateObj.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });

    const dateKey = dateObj.toDateString();

    if (!groups[monthKey]) groups[monthKey] = {};
    if (!groups[monthKey][dateKey]) groups[monthKey][dateKey] = [];

    groups[monthKey][dateKey].push(photo);
  });
  return groups;
}

function MainContainer() {
  const [photos, setPhotos] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [trashFilter, setTrashFilter] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [expandAlbums, setExpandAlbums] = useState(false);
  const [showCreateAlbum, setShowCreateAlbum] = useState(false);
  const [favouriteFilter, setFavouriteFilter] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const toggleSelectPhoto = (photoId) => {
    setSelectedPhotos((prev) =>
      prev.includes(photoId)
        ? prev.filter((id) => id !== photoId)
        : [...prev, photoId]
    );
  };

  const handleDeletePhotos = async () => {
    try {
      await axios.post("http://localhost:3000/photos/delete", {
        photoIds: selectedPhotos,
      });
      setSelectedPhotos([]);
      fetchPhotos(1, false, selectedAlbum?._id, searchText, favouriteFilter);
    } catch (err) {
      console.error("Failed to delete photos:", err);
    }
  };

  const fetchPhotos = async (
    page = 1,
    append = false,
    albumId = null,
    search = "",
    isFav = false,
    isDeleted = false
  ) => {
    try {
      setLoading(true);

      const params = {
        pageNumber: page,
        pageSize: 50,
      };

      if (search) params.searchText = search;
      if (albumId) params.albumId = albumId;
      if (isFav) params.isFav = true;
      if (isDeleted) params.isDeleted = isDeleted;
      console.log(isDeleted);

      const res = await axios.get("http://localhost:3000/photos/get/photos", {
        params,
      });

      const { photos: newPhotos, totalPages } = res.data;

      setPhotos((prev) => (append ? [...prev, ...newPhotos] : newPhotos));
      setHasMore(page < totalPages);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch photos:", err);
      setLoading(false);
    }
  };

  const fetchAlbums = async () => {
    try {
      const res = await axios.get("http://localhost:3000/photos/get/albums");
      setAlbums(res.data);
    } catch (err) {
      console.error("Failed to fetch albums:", err);
    }
  };

  const handleAlbumSubmit = async (name) => {
    try {
      await axios.post("http://localhost:3000/photos/create/album", { name });
      await fetchAlbums();
      setShowCreateAlbum(false);
    } catch (err) {
      console.error("Error creating album:", err);
    }
  };

  const handleSavePhoto = async ({
    url,
    albumId,
    title,
    description,
    tags,
  }) => {
    try {
      await axios.post("http://localhost:3000/photos/save/photo", {
        url,
        albumId,
        title,
        description,
        tags,
      });
      setUploadModalOpen(false);
      fetchPhotos(1, false, selectedAlbum?._id, searchText, favouriteFilter);
    } catch (err) {
      console.error("Failed to save photo:", err);
    }
  };

  const handleEditPhoto = async (photo) => {
    try {
      await axios.post("http://localhost:3000/photos/update", {
        photoId: photo._id,
        albumId: photo.albumId,
        title: photo.title,
        description: photo.description,
        tags: photo.tags,
        url: photo.url,
        fav: photo.favourite,
      });
      setEditingPhoto(null);
      fetchPhotos(1, false, selectedAlbum?._id, searchText, favouriteFilter);
    } catch (err) {
      console.error("Failed to update photo:", err);
    }
  };

  useEffect(() => {
    fetchAlbums();
    fetchPhotos();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 200 &&
        hasMore &&
        !loading
      ) {
        const nextPage = pageNumber + 1;
        setPageNumber(nextPage);
        fetchPhotos(
          nextPage,
          true,
          selectedAlbum?._id,
          searchText,
          favouriteFilter
        );
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [
    pageNumber,
    loading,
    hasMore,
    selectedAlbum,
    searchText,
    favouriteFilter,
  ]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);
    setPageNumber(1);
    fetchPhotos(1, false, selectedAlbum?._id, value, favouriteFilter);
  };

  const handleUploadPhotos = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post(
        "http://localhost:3000/photos/upload/photos",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setPreviewImageUrl(res.data.url);
      setUploadModalOpen(true);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  const openEditModal = (photo) => {
    setEditingPhoto(photo);
  };

  const photoGroups = groupPhotosByMonth(photos);

  return (
    <div className="flex h-screen overflow-hidden bg-[#121212] text-white">
      {showCreateAlbum && (
        <CreateAlbumModal
          onClose={() => setShowCreateAlbum(false)}
          onSubmit={handleAlbumSubmit}
        />
      )}

      {uploadModalOpen && (
        <UploadPhotoModal
          url={previewImageUrl}
          albumId={selectedAlbum?._id || null}
          onClose={() => setUploadModalOpen(false)}
          onSave={handleSavePhoto}
        />
      )}

      {editingPhoto && (
        <EditPhotoModal
          photo={editingPhoto}
          onClose={() => setEditingPhoto(null)}
          onSave={handleEditPhoto}
        />
      )}

      {showDeleteModal && (
        <ConfirmDeleteModal
          count={selectedPhotos.length}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeletePhotos}
        />
      )}

      <aside className="w-64 bg-[#1E1E1E] p-5 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-6">Pando.ai Photos</h1>
          <nav className="space-y-2">
            <button
              className={`flex items-center gap-2 w-full text-left py-2 px-3 rounded-xl ${
                !selectedAlbum && !favouriteFilter && !trashFilter
                  ? "bg-blue-600"
                  : "hover:bg-[#2d2d2d]"
              }`}
              onClick={() => {
                setSelectedAlbum(null);
                setFavouriteFilter(false);
                setTrashFilter(false);
                fetchPhotos(1, false);
              }}
            >
              <ImageIcon size={16} /> Photos
            </button>
          </nav>

          <div className="mt-6">
            <h2 className="text-sm text-gray-400 uppercase mb-2">
              Collections
            </h2>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setExpandAlbums((prev) => !prev)}
                  className="flex items-center gap-2 w-full py-2 px-3 rounded-xl hover:bg-[#2d2d2d]"
                >
                  {expandAlbums ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}{" "}
                  Albums
                </button>
                {expandAlbums && (
                  <div className="mt-2 max-h-[300px] overflow-y-auto ml-2 pr-2 space-y-1">
                    <div
                      onClick={() => setShowCreateAlbum(true)}
                      className="flex items-center gap-2 cursor-pointer p-1 px-4 text-blue-200 hover:bg-[#636262] rounded-lg text-md"
                    >
                      <Plus size={14} /> Create Album
                    </div>
                    {albums.map((album) => (
                      <div
                        key={album._id}
                        className={`flex items-center gap-2 cursor-pointer p-1 px-4 rounded-md ${
                          selectedAlbum?._id === album._id
                            ? "bg-blue-700"
                            : "hover:bg-[#2d2d2d]"
                        }`}
                        onClick={() => {
                          setSelectedAlbum(album);
                          setFavouriteFilter(false);
                          setTrashFilter(false);
                          fetchPhotos(1, false, album._id);
                        }}
                      >
                        <span className="text-sm truncate">{album.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </li>

              <li>
                <button
                  className={`w-full text-left py-2 px-3 rounded-xl hover:bg-[#2d2d2d] ${
                    favouriteFilter ? "bg-blue-600" : ""
                  }`}
                  onClick={() => {
                    setSelectedAlbum(null);
                    setFavouriteFilter(true);
                    setTrashFilter(false);
                    fetchPhotos(1, false, null, searchText, true);
                  }}
                >
                  Favourites
                </button>
              </li>

              <li>
                <button
                  className={`w-full text-left py-2 px-3 rounded-xl hover:bg-[#2d2d2d] ${
                    trashFilter ? "bg-blue-600" : ""
                  }`}
                  onClick={() => {
                    setSelectedAlbum(null);
                    setFavouriteFilter(false);
                    setTrashFilter(true);
                    fetchPhotos(1, false, null, searchText, false, true);
                  }}
                >
                  Trash
                </button>
              </li>

              <li>
                <button className="w-full text-left py-2 px-3 rounded-xl hover:bg-[#2d2d2d]">
                  People
                </button>
              </li>
              <li>
                <button className="w-full text-left py-2 px-3 rounded-xl hover:bg-[#2d2d2d]">
                  Places
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-sm text-gray-400">
          <p>Storage</p>
          <p className="text-white">Unlimited Photos storage</p>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="bg-[#1E1E1E] p-4 shadow-md sticky top-0 z-10 flex justify-between items-center">
          <input
            type="text"
            value={searchText}
            onChange={handleSearch}
            placeholder="Search photos"
            className="px-4 py-2 rounded-md w-full max-w-xl bg-[#2B2B2B] text-white placeholder-gray-400"
          />
          {selectedPhotos.length > 0 ? (
            <button
              onClick={() => setShowDeleteModal(true)}
              className="ml-4 bg-red-600 px-4 py-2 rounded hover:bg-red-700 flex items-center gap-2"
            >
              <Trash2 size={16} /> Delete ({selectedPhotos.length})
            </button>
          ) : (
            <label className="ml-4 cursor-pointer bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">
              Upload
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleUploadPhotos}
              />
            </label>
          )}
        </div>

        <div className="p-6 space-y-10">
          {Object.entries(photoGroups).map(([month, dates]) => (
            <div key={month}>
              <h2 className="text-2xl font-semibold mb-1">{month}</h2>
              {Object.entries(dates).map(([date, group]) => (
                <div key={date} className="mb-8">
                  <p className="text-gray-400 mb-2 text-sm">{date}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {group.map((photo) => (
                      <div
                        key={photo._id}
                        className={`relative w-full h-[180px] overflow-hidden rounded shadow cursor-pointer group ${
                          selectedPhotos.includes(photo._id)
                            ? "ring-1 ring-blue-700"
                            : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (selectedPhotos.length) {
                            toggleSelectPhoto(photo._id);
                          } else {
                            openEditModal(photo);
                          }
                        }}
                      >
                        <img
                          src={photo.url}
                          alt=""
                          className={`object-cover w-full h-full transition ${
                            selectedPhotos.includes(photo._id)
                              ? "brightness-50 scale-[0.98]"
                              : ""
                          }`}
                        />
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSelectPhoto(photo._id);
                          }}
                          className={`absolute top-2 right-2 w-5 h-5 sm:w-5 sm:h-5 border-2 rounded-full items-center justify-center text-black text-xs ${
                            selectedPhotos.includes(photo._id)
                              ? "flex bg-blue-500 text-white"
                              : "hidden group-hover:flex bg-white"
                          }`}
                        >
                          {selectedPhotos.includes(photo._id) && (
                            <Check strokeWidth={4} color="white" size={12} />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
          {loading && (
            <div className="flex justify-center items-center py-8">
              <div className="w-6 h-6 border-2 border-t-transparent border-white rounded-full animate-spin" />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default MainContainer;
