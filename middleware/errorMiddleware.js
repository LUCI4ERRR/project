function errorMiddleware(err, req, res, next) {
  console.error("Unhandled error:", err);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || "Internal Server Error" });
}

module.exports = errorMiddleware;
