
# 📸 Pando.ai Photos A modern, full-featured photo management application supporting albums, favorites, search, trash (soft-delete), and more.

 ## 📐 Architecture

├── client/ # React frontend  
│ ├── components/ # UI components (modals, grid, sidebar)  
│ └── App.jsx  
│  
├── server/ # Node.js backend  
│ ├── controllers/ # Route logic (photos, albums)  
│ ├── routes/ # Express route definitions  
│ └── models/ # Mongoose schemas (Photo, Album)


### 2\. Install Dependencies

#### Frontend

`cd client
npm install` 

#### Backend

`cd server
npm install` 

* * *

### 3\. Configure Environment

Create `.env` files:

**server/.env**

`PORT=3000
MONGO_URI=mongodb://localhost:27017/pando
CLOUDINARY_URL=...` 

* * *

### 4\. Run the Project

#### Backend

`cd server
npm run dev` 

#### Frontend

`cd client
npm run dev` 

* * *
---

## 🐳 Run Fake S3 (MinIO) with Docker

You can use [MinIO](https://min.io/) to run a fake S3 locally for uploads.

### 📦 1. Start MinIO with Docker

```bash
docker run -d --name minio \
  -p 9000:9000 -p 9001:9001 \
  -e "MINIO_ROOT_USER=admin" \
  -e "MINIO_ROOT_PASSWORD=password" \
  quay.io/minio/minio server /data --console-address ":9001"
```

## Demo

<img width="1440" alt="Screenshot 2025-06-01 at 2 16 35 PM" src="https://github.com/user-attachments/assets/31d00d45-a721-4294-81d9-ff16f6e64324" />


🧪 Features
-----------

*   Infinite scroll with lazy loading
    
*   Album creation and tagging
    
*   Modal-based editing UX
    
*   Favourites & Trash filters
    
*   Soft-delete photos
    
*   Tailwind UI
    

