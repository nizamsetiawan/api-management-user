import { ResponseError } from "../error/response.error.js";

// Middleware untuk menangani error
const errorMiddleware = async (err, req, res, next) => {
  // Jika tidak ada error, lanjutkan ke middleware berikutnya
  if (!err) {
    next();
    return;
  }

  // Jika error adalah instance dari ResponseError, kembalikan response error
  if (err instanceof ResponseError) {
    // Kembalikan response error dengan status dan pesan error
    res
      .status(err.status)
      .json({
        errors: err.message,
      })
      .end();
  } else {
    // Jika error bukan instance dari ResponseError, kembalikan response error dengan status 500
    res
      .status(500)
      .json({
        errors: err.message,
      })
      .end();
  }
};

export { errorMiddleware };
