import userService from "../service/user-service.js";
import { successResponse } from "../utils/response.js";

// Fungsi untuk menangani registrasi user baru
const register = async (req, res, next) => {
  try {
    // Panggil service untuk proses registrasi
    // req.body berisi data user yang akan diregistrasi
    const result = await userService.register(req.body);
    // Mengembalikan response sukses dengan status 201
    return successResponse(res, 201, "User registered successfully", result);
  } catch (error) {
    // Jika terjadi error, lewati ke error handler middleware
    next(error);
  }
};

// Fungsi untuk menangani login user
const login = async (req, res, next) => {
  try {
    // Panggil service untuk proses login
    // req.body berisi email dan password
    const result = await userService.login(req.body);
    // Mengembalikan response sukses dengan status 200
    return successResponse(res, 200, "Login successful", result);
  } catch (error) {
    // Jika terjadi error, lewati ke error handler middleware
    next(error);
  }
};

// Fungsi untuk mendapatkan data user yang sedang login
const get = async (req, res, next) => {
  try {
    // Panggil service untuk mendapatkan data user
    // req.user.email berisi email dari user yang sudah terautentikasi
    const result = await userService.get(req.user.email);
    // Mengembalikan response sukses dengan status 200
    return successResponse(res, 200, "User retrieved successfully", result);
  } catch (error) {
    // Jika terjadi error, lewati ke error handler middleware
    next(error);
  }
};

// Fungsi untuk mendapatkan semua data user
const getAllUsers = async (req, res, next) => {
  try {
    // Panggil service untuk mendapatkan semua data user
    const result = await userService.getAllUsers();
    // Mengembalikan response sukses dengan status 200
    return successResponse(res, 200, "Users retrieved successfully", result);
  } catch (error) {
    // Jika terjadi error, lewati ke error handler middleware
    next(error);
  }
};

// Fungsi untuk mengupdate data user yang sedang login
const update = async (req, res, next) => {
  try {
    // Mengambil email dari user yang sedang login
    const email = req.user.email;
    // Mengambil data request dari body
    const request = req.body;
    // Mengupdate email dari request dengan email dari user yang sedang login
    request.email = email;

    // Panggil service untuk update user
    const result = await userService.update(email, request);
    // Mengembalikan response sukses dengan status 200
    return successResponse(res, 200, "User updated successfully", result);
  } catch (error) {
    // Jika terjadi error, lewati ke error handler middleware
    next(error);
  }
};

// Fungsi untuk menangani logout user
const logout = async (req, res, next) => {
  try {
    // Panggil service untuk logout
    await userService.logout(req.user.email);
    // Mengembalikan response sukses dengan status 200
    return successResponse(res, 200, "Logout successful");
  } catch (error) {
    // Jika terjadi error, lewati ke error handler middleware
    next(error);
  }
};

// Export fungsi-fungsi controller untuk digunakan di routes
export default {
  register,
  login,
  get,
  getAllUsers,
  update,
  logout,
};
