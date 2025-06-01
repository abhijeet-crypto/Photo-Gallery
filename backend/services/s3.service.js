
const { s3Client } = require('../config/config');
const {
  PutObjectCommand,
  HeadBucketCommand,
  CreateBucketCommand,
} = require('@aws-sdk/client-s3');
const { randomUUID } = require('crypto');

const BUCKET_NAME = 'photo-bucket';
const S3_BASE_URL = 'http://localhost:9000';

let bucketEnsured = false;

const ensureBucketExists = async () => {
  if (bucketEnsured) return;

  try {
    await s3Client.send(new HeadBucketCommand({ Bucket: BUCKET_NAME }));
  } catch (err) {
    if (
      err?.$metadata?.httpStatusCode === 404 ||
      err.name === 'NotFound'
    ) {
      await s3Client.send(new CreateBucketCommand({ Bucket: BUCKET_NAME }));
      console.log(`✅ Bucket "${BUCKET_NAME}" created`);
    } else {
      console.error('❌ Failed to ensure bucket:', err);
      throw err;
    }
  }

  bucketEnsured = true;
};

const uploadToS3 = async (buffer, filename, mimetype) => {
  await ensureBucketExists();

  const safeFilename = filename.replace(/\s+/g, '_').replace(/[^\w.-]/g, '');
  const key = `${randomUUID()}-${safeFilename}`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: mimetype,
    })
  );

  return `${S3_BASE_URL}/${BUCKET_NAME}/${encodeURIComponent(key)}`;
};

module.exports = {
  uploadToS3,
};
