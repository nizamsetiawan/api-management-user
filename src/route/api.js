// Import dependencies yang diperlukan
import express from "express";
import userController from "../controller/user-controller.js";
import contactController from "../controller/contact-controller.js";
import addressController from "../controller/address-controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";

// Buat instance router baru
const router = new express.Router();

// Route publik (tidak memerlukan autentikasi)
// Route untuk registrasi user baru
router.post("/api/users", userController.register);
// Route untuk login user
router.post("/api/users/login", userController.login);

// Terapkan middleware autentikasi untuk semua route di bawah ini
router.use(authMiddleware);

// Route untuk manajemen user (memerlukan autentikasi)
// Mendapatkan data user yang sedang login
router.get("/api/users/current", userController.get);
// Mendapatkan semua data user
router.get("/api/users", userController.getAllUsers);
// Mengupdate data user yang sedang login
router.patch("/api/users/current", userController.update);
// Logout user
router.delete("/api/users/logout", userController.logout);

// Route untuk manajemen kontak (memerlukan autentikasi)
// Membuat kontak baru
router.post("/api/contacts", contactController.createContact);
// Mendapatkan semua kontak user
router.get("/api/contacts", contactController.getContacts);
// Mendapatkan kontak berdasarkan ID
router.get("/api/contacts/:contactId", contactController.getContact);
// Mengupdate kontak berdasarkan ID
router.put("/api/contacts/:contactId", contactController.updateContact);
// Menghapus kontak berdasarkan ID
router.delete("/api/contacts/:contactId", contactController.removeContact);

// Route untuk manajemen alamat (memerlukan autentikasi)
// Membuat alamat baru untuk kontak
router.post("/api/contacts/:contactId/addresses", addressController.createAddress);
// Mendapatkan semua alamat dari sebuah kontak
router.get("/api/contacts/:contactId/addresses", addressController.getAddresses);
// Mengupdate alamat berdasarkan ID
router.put("/api/contacts/:contactId/addresses/:addressId", addressController.updateAddress);
// Menghapus alamat berdasarkan ID
router.delete("/api/contacts/:contactId/addresses/:addressId", addressController.removeAddress);

export { router }; 