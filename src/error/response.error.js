class ResponseError extends Error {
  // Constructor untuk ResponseError
  constructor(status, message) {
    // Memanggil constructor dari kelas Error
    super(message);
    // Menyimpan status error ke dalam instance
    this.status = status;
  }
}

export { ResponseError };
