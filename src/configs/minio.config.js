const Minio = require("minio");

let minioFunc = null;

module.exports = {
  connect: async function () {
    if (minioFunc) return minioFunc;

    minioFunc = new Minio.Client({
      endPoint: env.MINIO_ENDPOINT,
      port: env.MINIO_PORT,
      useSSL: env.MINIO_USE_SSL,
      accessKey: env.MINIO_ACCESS_KEY,
      secretKey: env.MINIO_SECRET_KEY,
    });

    const bucketExists = await minioFunc.bucketExists(env.MINIO_BUCKET_NAME);
    if (!bucketExists) {
      await minioFunc.makeBucket(env.MINIO_BUCKET_NAME);
    }

    minioFunc.uploadFile = async function (file) {
      return this.putObject(env.MINIO_BUCKET_NAME, file.filename, file.buffer);
    };

    minioFunc.destroyFile = async function (fileName) {
      return this.removeObject(env.MINIO_BUCKET_NAME, fileName);
    };

    global.minio = minioFunc;
    log.info("✅ Connected to Minio");
  },
};
