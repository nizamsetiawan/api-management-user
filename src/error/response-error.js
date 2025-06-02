// Custom error class untuk menangani response error
class ResponseError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export { ResponseError }; 