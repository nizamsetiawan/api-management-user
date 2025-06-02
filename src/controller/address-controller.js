import addressService from "../service/address-service.js";
import { successResponse } from "../utils/response.js";

// Fungsi untuk membuat alamat baru
const createAddress = async (req, res, next) => {
  try {
    // Mengambil ID kontak dari parameter
    const contactId = parseInt(req.params.contactId);
    // Memanggil service untuk membuat alamat baru
    const result = await addressService.createAddress(contactId, req.body);
    // Mengembalikan response sukses dengan status 201
    return successResponse(res, 201, "Address created successfully", result);
  } catch (error) {
    // Jika terjadi error, lewati ke error handler middleware
    next(error);
  }
};

// Fungsi untuk mendapatkan semua alamat dari sebuah kontak
const getAddresses = async (req, res, next) => {
  try {
    // Mengambil ID kontak dari parameter
    const contactId = parseInt(req.params.contactId);
    // Memanggil service untuk mendapatkan semua alamat dari sebuah kontak
    const result = await addressService.getAddresses(contactId);
    // Mengembalikan response sukses dengan status 200
    return successResponse(res, 200, "Addresses retrieved successfully", result);
  } catch (error) {
    // Jika terjadi error, lewati ke error handler middleware
    next(error);
  }
};

// Fungsi untuk mengupdate alamat
const updateAddress = async (req, res, next) => {
  try {
    // Mengambil ID alamat dari parameter
    const addressId = parseInt(req.params.addressId);
    // Memanggil service untuk mengupdate alamat
    const result = await addressService.updateAddress(addressId, req.body);
    // Mengembalikan response sukses dengan status 200
    return successResponse(res, 200, "Address updated successfully", result);
  } catch (error) {
    // Jika terjadi error, lewati ke error handler middleware
    next(error);
  }
};

// Fungsi untuk menghapus alamat
const removeAddress = async (req, res, next) => {
  try {
    // Mengambil ID alamat dari parameter
    const addressId = parseInt(req.params.addressId);
    // Memanggil service untuk menghapus alamat
    await addressService.removeAddress(addressId);
    // Mengembalikan response sukses dengan status 200
    return successResponse(res, 200, "Address removed successfully");
  } catch (error) {
    // Jika terjadi error, lewati ke error handler middleware
    next(error);
  }
};

export default {
  createAddress,
  getAddresses,
  updateAddress,
  removeAddress,
}; 