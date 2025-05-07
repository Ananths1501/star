module.exports = {
  PORT: process.env.PORT || 3000,
  JWT_SECRET: process.env.JWT_SECRET || "star-electricals-secret-key",
  JWT_EXPIRE: "7d",
  UPLOAD_PATH: "uploads/",
  FRONTEND_UPLOAD_PATH: "../frontend/public/uploads/",
}
