// Import dependencies yang diperlukan
import contactService from "../service/contact-service.js";
import { successResponse } from "../utils/response.js";

// Fungsi untuk membuat kontak baru
const createContact = async (req, res, next) => {
  try {
    // Memanggil service untuk membuat kontak baru
    const result = await contactService.createContact(req.user, req.body);
    // Mengembalikan response sukses dengan status 201
    return successResponse(res, 201, "Contact created successfully", result);
  } catch (error) {
    // Jika terjadi error, lewati ke error handler middleware
    next(error);
  }
};

// Fungsi untuk mendapatkan kontak berdasarkan ID
const getContact = async (req, res, next) => {
  try {
    // Mengambil ID kontak dari parameter dan konversi ke integer
    const contactId = parseInt(req.params.contactId);
    // Memanggil service untuk mendapatkan kontak berdasarkan ID
    const result = await contactService.getContact(req.user, contactId);
    // Mengembalikan response sukses dengan status 200
    return successResponse(res, 200, "Contact retrieved successfully", result);
  } catch (error) {
    // Jika terjadi error, lewati ke error handler middleware
    next(error);
  }
};

// Fungsi untuk mendapatkan semua kontak user
const getContacts = async (req, res, next) => {
  try {
    // Memanggil service untuk mendapatkan semua kontak user
    const result = await contactService.getContacts(req.user.email);
    // Mengembalikan response sukses dengan status 200
    return successResponse(res, 200, "Contacts retrieved successfully", result);
  } catch (error) {
    // Jika terjadi error, lewati ke error handler middleware
    next(error);
  }
};

// Fungsi untuk mencari kontak
const searchContacts = async (req, res, next) => {
  try {
    // Mengambil parameter pencarian
    const { name, email, phone, page, size } = req.query;
    // Memanggil service untuk mencari kontak
    const result = await contactService.searchContacts(req.user, { name, email, phone, page, size });
    // Mengembalikan response sukses dengan status 200
    return successResponse(res, 200, "Contacts retrieved successfully", result);
  } catch (error) {
    // Jika terjadi error, lewati ke error handler middleware
    next(error);
  }
};

// Fungsi untuk mengupdate kontak berdasarkan ID
const updateContact = async (req, res, next) => {
  try {
    // Mengambil ID kontak dari parameter dan konversi ke integer
    const contactId = parseInt(req.params.contactId);
    // Memanggil service untuk mengupdate kontak berdasarkan ID
    const result = await contactService.updateContact(req.user, contactId, req.body);
    // Mengembalikan response sukses dengan status 200
    return successResponse(res, 200, "Contact updated successfully", result);
  } catch (error) {
    // Jika terjadi error, lewati ke error handler middleware
    next(error);
  }
};

// Fungsi untuk menghapus kontak berdasarkan ID
const removeContact = async (req, res, next) => {
  try {
    // Mengambil ID kontak dari parameter dan konversi ke integer
    const contactId = parseInt(req.params.contactId);
    // Memanggil service untuk menghapus kontak berdasarkan ID
    await contactService.removeContact(req.user, contactId);
    // Mengembalikan response sukses dengan status 200
    return successResponse(res, 200, "Contact deleted successfully", null);
  } catch (error) {
    // Jika terjadi error, lewati ke error handler middleware
    next(error);
  }
};

export default {
  createContact,
  getContact,
  getContacts,
  searchContacts,
  updateContact,
  removeContact,
};
