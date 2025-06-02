import { validate } from "../validation/validation.js";
import { createAddressValidation, updateAddressValidation } from "../validation/address-validation.js";
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response.error.js";

// Fungsi untuk membuat alamat baru
const createAddress = async (contactId, request) => {
  // Validasi data request
  const address = validate(createAddressValidation, request);

  // Cek apakah kontak ada
  const contact = await prismaClient.contact.findUnique({
    where: {
      id: contactId,
    },
  });

  // Jika kontak tidak ditemukan, lewati ke error handler middleware
  if (!contact) {
    throw new ResponseError(404, "Contact not found");
  }

  // Tambahkan contactId ke data alamat
  address.contactId = contactId;

  // Simpan alamat baru ke database
  return prismaClient.address.create({
    data: address,
    // Mengembalikan data alamat yang baru dibuat
    select: {
      id: true,
      street: true,
      city: true,
      province: true,
      postal_code: true,
      country: true,
    },
  });
};

// Fungsi untuk mendapatkan semua alamat dari sebuah kontak
const getAddresses = async (contactId) => {
  // Cek apakah kontak ada
  const contact = await prismaClient.contact.findUnique({
    where: {
      id: contactId,
    },
  });

  if (!contact) {
    throw new ResponseError(404, "Contact not found");
  }

  // Ambil semua alamat dari kontak
  const addresses = await prismaClient.address.findMany({
    // Ambil semua alamat dari kontak
    where: {
      contactId: contactId,
    },
    // Mengembalikan data alamat yang ditemukan
    select: {
      id: true,
      street: true,
      city: true,
      province: true,
      postal_code: true,
      country: true,
    },
  });

  if (!addresses || addresses.length === 0) {
    throw new ResponseError(404, "Addresses not found");
  }

  return addresses;
};

// Fungsi untuk mengupdate alamat
const updateAddress = async (addressId, request) => {
  // Validasi data request
  const address = validate(updateAddressValidation, request);

  // Cek apakah alamat ada
  const foundAddress = await prismaClient.address.findUnique({
    where: {
      id: addressId,
    },
  });

  if (!foundAddress) {
    throw new ResponseError(404, "Address not found");
  }

  // Update data alamat
  return prismaClient.address.update({
    where: {
      id: addressId,
    },
    // Update data alamat
    data: address,
    // Mengembalikan data alamat yang diupdate
    select: {
      id: true,
      street: true,
      city: true,
      province: true,
      postal_code: true,
      country: true,
    },
  });
};

// Fungsi untuk menghapus alamat
const removeAddress = async (addressId) => {
  // Cek apakah alamat ada
  const address = await prismaClient.address.findUnique({
    where: {
      id: addressId,
    },
  });

  if (!address) {
    throw new ResponseError(404, "Address not found");
  }

  // Hapus alamat
  return prismaClient.address.delete({
    where: {
      id: addressId,
    },
  });
};

export default {
  createAddress,
  getAddresses,
  updateAddress,
  removeAddress,
}; 