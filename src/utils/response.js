const successResponse = (res, statusCode, message, data = null) => {
  return res.status(statusCode).json({
    // Mengembalikan status success
    status: "success",
    message,
    data,
    timestamp: new Date().toISOString(),
  });
};

const errorResponse = (res, statusCode, message, errors = null) => {
  // Mengembalikan status error
  return res.status(statusCode).json({
    status: "error",
    message,
    errors,
    timestamp: new Date().toISOString(),
  });
};

export { successResponse, errorResponse };