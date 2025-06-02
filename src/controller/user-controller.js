import userService from "../service/user-service.js";

const register = async (req, res, next) => {
  try {
    // Panggil service untuk proses registrasi
    // req.body berisi data user yang akan diregistrasi
    const result = await userService.register(req.body);

    // Kirim response sukses dengan status 200
    // Data user yang berhasil diregistrasi dikirim dalam format { data: result }
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    // Jika terjadi error, lewati ke error handler middleware
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    // Panggil service untuk proses login
    // req.body berisi username dan password
    const result = await userService.login(req.body);

    // Kirim response sukses dengan status 200
    // Token autentikasi dikirim dalam format { data: result }
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    // Jika terjadi error, lewati ke error handler middleware
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    // Panggil service untuk mendapatkan data user
    // req.user.username berisi username dari user yang sudah terautentikasi
    const result = await userService.getUser(req.user.username);

    // Kirim response sukses dengan status 200
    // Data user dikirim dalam format { data: result }
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    // Jika terjadi error, lewati ke error handler middleware
    next(error);
  }
};

/**
 * Fungsi untuk mendapatkan semua data user
 * @param {Object} req - Request object dari Express
 * @param {Object} res - Response object dari Express
 * @param {Function} next - Next middleware function
 */
const getAllUsers = async (req, res, next) => {
  try {
    // Panggil service untuk mendapatkan semua data user
    const result = await userService.getAllUsers();

    // Kirim response sukses dengan status 200
    // Data users dikirim dalam format { data: result }
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    // Jika terjadi error, lewati ke error handler middleware
    next(error);
  }
};

// Export fungsi-fungsi controller untuk digunakan di routes
export default {
  register,
  login,
  getUser,
  getAllUsers,
};
