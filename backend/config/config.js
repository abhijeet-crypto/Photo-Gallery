// config/s3.config.js

const { S3Client } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
  endpoint: 'http://localhost:9000', // Local MinIO or similar S3-compatible service
  region: 'us-east-1',
  credentials: {
    accessKeyId: 'minio',
    secretAccessKey: 'minio123',
  },
  forcePathStyle: true,
});

module.exports = { s3Client };
