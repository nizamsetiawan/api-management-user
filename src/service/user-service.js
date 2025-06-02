import { validate } from "../validation/validation.js";
import {
  loginUserValidation,
  registerUserValidation,
} from "../validation/user-validation.js";
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response.error.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

/**
 * Fungsi untuk registrasi user baru
 * @param {Object} request - Data user yang akan diregistrasi
 * @returns {Promise<Object>} Data user yang berhasil diregistrasi
 */
const register = async (request) => {
  // Validasi data request menggunakan schema registerUserValidation
  const user = validate(registerUserValidation, request);

  // Cek apakah username sudah ada di database
  const countUser = await prismaClient.user.count({
    where: {
      username: user.username,
    },
  });

  // Jika username sudah ada (countUser === 1), throw error
  if (countUser === 1) {
    throw new ResponseError(400, "User already exists with this email");
  }

  // Enkripsi password menggunakan bcrypt dengan 10 rounds
  user.password = await bcrypt.hash(user.password, 10);

  // Simpan data user baru ke database
  // Hanya return username dan name (tidak termasuk password)
  return prismaClient.user.create({
    data: user,
    select: {
      username: true,
      name: true,
    },
  });
};

/**
 * Fungsi untuk login user
 * @param {Object} request - Data login (username dan password)
 * @returns {Promise<Object>} Token autentikasi
 */
const login = async (request) => {
  // Validasi data request menggunakan schema loginUserValidation
  const user = validate(loginUserValidation, request);

  // Cari user berdasarkan username
  // Hanya ambil username dan password untuk verifikasi
  const foundUser = await prismaClient.user.findUnique({
    where: {
      username: user.username,
    },
    select: {
      username: true,
      password: true,
    },
  });

  // Jika user tidak ditemukan, throw error
  if (!foundUser) {
    throw new ResponseError(401, "User not found");
  }

  // Verifikasi password menggunakan bcrypt
  const isPasswordValid = await bcrypt.compare(
    user.password,
    foundUser.password
  );
  // Jika password tidak valid, throw error
  if (!isPasswordValid) {
    throw new ResponseError(400, "Invalid password");
  }

  // Generate token unik menggunakan UUID
  const token = uuid().toString();

  // Update token user di database
  // Hanya return token untuk keamanan
  return prismaClient.user.update({
    where: {
      username: user.username,
    },
    data: {
      token: token,
    },
    select: {
      token: true,
    },
  });
};

/**
 * Fungsi untuk mendapatkan data user berdasarkan username
 * @param {string} username - Username yang akan dicari
 * @returns {Promise<Object>} Data user yang ditemukan
 */
const getUser = async (username) => {
  const user = await prismaClient.user.findUnique({
    where: {
      username: username,
    },
    select: {
      username: true,
      name: true,
      token: true,
    },
  });

  if (!user) {
    throw new ResponseError(404, "User not found");
  }

  return user;
};

/**
 * Fungsi untuk mendapatkan semua data user
 * @returns {Promise<Array>} Array berisi data semua user
 */
const getAllUsers = async () => {
  // Validasi tidak diperlukan karena tidak ada parameter input
  const users = await prismaClient.user.findMany({
    select: {
      username: true,
      name: true,
      token: true,
    },
  });

  if (!users || users.length === 0) {
    throw new ResponseError(404, "No users found");
  }

  return users;
};

// Export fungsi-fungsi yang akan digunakan di controller
export default {
  register,
  login,
  getUser,
  getAllUsers,
};
