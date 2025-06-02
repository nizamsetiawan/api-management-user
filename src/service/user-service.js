import { validate } from "../validation/validation.js";
import {
  loginUserValidation,
  registerUserValidation,
  updateUserValidation,
} from "../validation/user-validation.js";
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response.error.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

// Fungsi untuk registrasi user baru
const register = async (request) => {
  // Validasi data request
  const user = validate(registerUserValidation, request);

  // Cek apakah email sudah ada
  const countUser = await prismaClient.user.count({
    where: {
      email: user.email,
    },
  });

  if (countUser === 1) {
    throw new ResponseError(400, "Email already exists");
  }

  // Enkripsi password
  user.password = await bcrypt.hash(user.password, 10);

  // Simpan user baru ke database
  return prismaClient.user.create({
    data: user,
    // Mengembalikan data user yang baru dibuat
    select: {
      email: true,
      name: true,
    },
  });
};

// Fungsi untuk login user
const login = async (request) => {
  // Validasi data request
  const loginRequest = validate(loginUserValidation, request);

  // Cari user berdasarkan email
  const user = await prismaClient.user.findUnique({
    where: {
      email: loginRequest.email,
    },
    // Mengembalikan data user yang ditemukan
    select: {
      email: true,
      password: true,
    },
  });

  // Validasi user dan password
  if (!user) {
    throw new ResponseError(401, "Email or password wrong");
  }

  const isPasswordValid = await bcrypt.compare(
    loginRequest.password,
    user.password
  );
  if (!isPasswordValid) {
    throw new ResponseError(401, "Email or password wrong");
  }

  // Generate token dan update user
  const token = uuid().toString();
  return prismaClient.user.update({
    // Update data user
    data: {
      token: token,
    },
    // Cari user berdasarkan email
    where: {
      email: user.email,
    },
    select: {
      token: true,
    },
  });
};

// Fungsi untuk mendapatkan data user berdasarkan email
const get = async (email) => {
  const user = await prismaClient.user.findUnique({
    // Cari user berdasarkan email
    where: {
      email: email,
    },
    // Mengembalikan data user yang diupdate
    select: {
      email: true,
      name: true,
    },
  });

  if (!user) {
    throw new ResponseError(404, "User is not found");
  }

  return user;
};

// Fungsi untuk mendapatkan semua user
const getAllUsers = async () => {
  // Cari semua user
  const users = await prismaClient.user.findMany({
    // Mengembalikan data user yang ditemukan
    select: {
      email: true,
      name: true,
    },
  });

  if (!users || users.length === 0) {
    throw new ResponseError(404, "No users found");
  }

  return users;
};

// Fungsi untuk mengupdate data user
const update = async (email, request) => {
  // Validasi data request
  const user = validate(updateUserValidation, request);

  // Cek apakah user ada
  const foundUser = await prismaClient.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!foundUser) {
    throw new ResponseError(404, "User is not found");
  }

  // Siapkan data yang akan diupdate
  const data = {};
  if (user.name) {
    data.name = user.name;
  }
  if (user.password) {
    data.password = await bcrypt.hash(user.password, 10);
  }

  // Update data user
  return prismaClient.user.update({
    where: {
      email: email,
    },
    data: data,
    select: {
      email: true,
      name: true,
    },
  });
};

// Fungsi untuk logout user
const logout = async (email) => {
  // Cek apakah user ada
  const user = await prismaClient.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    throw new ResponseError(404, "User is not found");
  }

  return prismaClient.user.update({
    // Cari user berdasarkan email
    where: {
      email: email,
    },
    // Update token menjadi null
    data: {
      token: null,
    },
    select: {
      email: true,
    },
  });
};

// Export fungsi-fungsi yang akan digunakan di controller
export default {
  register,
  login,
  get,
  getAllUsers,
  update,
  logout,
};
