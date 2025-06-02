import { validate } from "../validation/validation.js";
import { createContactValidation, updateContactValidation } from "../validation/contact-validation.js";
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";

// Fungsi untuk membuat kontak baru
const createContact = async (user, request) => {
  // Validasi data kontak
  const { firstName, lastName, email, phone } = request;

  // Validasi nama depan
  if (!firstName) {
    throw new ResponseError(400, "First name is required");
  }

  // Validasi email
  if (!email) {
    throw new ResponseError(400, "Email is required");
  }

  // Validasi format email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ResponseError(400, "Invalid email format");
  }

  // Validasi format nomor telepon
  if (phone) {
    const phoneRegex = /^[0-9+\-\s()]{10,15}$/;
    if (!phoneRegex.test(phone)) {
      throw new ResponseError(400, "Invalid phone number format");
    }
  }

  // Cek apakah email sudah terdaftar untuk user yang sama
  const existingContact = await prismaClient.contact.findFirst({
    where: {
      email: email,
      userEmail: user.email,
    },
  });

  if (existingContact) {
    throw new ResponseError(400, "Email already exists");
  }

  // Buat kontak baru
  const result = await prismaClient.contact.create({
    data: {
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      userEmail: user.email,
    },
  });

  return result;
};

// Fungsi untuk mendapatkan kontak berdasarkan ID
const getContact = async (user, contactId) => {
  // Validasi ID kontak
  if (!contactId || isNaN(contactId)) {
    throw new ResponseError(400, "Invalid contact ID");
  }

  // Cari kontak berdasarkan ID dan email user
  const contact = await prismaClient.contact.findFirst({
    where: {
      id: contactId,
      userEmail: user.email,
    },
  });

  // Jika kontak tidak ditemukan, throw error
  if (!contact) {
    throw new ResponseError(404, "Contact not found");
  }

  return contact;
};

// Fungsi untuk mendapatkan semua kontak user
const getContacts = async (userEmail) => {
  // Ambil semua kontak user
  const contacts = await prismaClient.contact.findMany({
    where: {
      userEmail: userEmail,
    },
  });

  return contacts;
};

// Fungsi untuk mencari kontak
const searchContacts = async (user, request) => {
  // Ambil parameter pencarian
  const { name, email, phone, page = 1, size = 10 } = request;

  // Buat filter pencarian
  const filter = {
    userEmail: user.email,
  };

  // Tambahkan filter nama jika ada
  if (name) {
    filter.OR = [
      {
        first_name: {
          contains: name,
        },
      },
      {
        last_name: {
          contains: name,
        },
      },
    ];
  }

  // Tambahkan filter email jika ada
  if (email) {
    filter.email = {
      contains: email,
    };
  }

  // Tambahkan filter nomor telepon jika ada
  if (phone) {
    filter.phone = {
      contains: phone,
    };
  }

  // Hitung total data
  const total = await prismaClient.contact.count({
    where: filter,
  });

  // Ambil data dengan pagination
  const contacts = await prismaClient.contact.findMany({
    where: filter,
    skip: (page - 1) * size,
    take: size,
  });

  return {
    data: contacts,
    paging: {
      page: parseInt(page),
      total_item: total,
      total_page: Math.ceil(total / size),
    },
  };
};

// Fungsi untuk mengupdate kontak berdasarkan ID
const updateContact = async (user, contactId, request) => {
  // Validasi ID kontak
  if (!contactId || isNaN(contactId)) {
    throw new ResponseError(400, "Invalid contact ID");
  }

  // Validasi data kontak
  const { firstName, lastName, email, phone } = request;

  // Validasi nama depan
  if (!firstName) {
    throw new ResponseError(400, "First name is required");
  }

  // Validasi email
  if (!email) {
    throw new ResponseError(400, "Email is required");
  }

  // Validasi format email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ResponseError(400, "Invalid email format");
  }

  // Validasi format nomor telepon
  if (phone) {
    const phoneRegex = /^[0-9+\-\s()]{10,15}$/;
    if (!phoneRegex.test(phone)) {
      throw new ResponseError(400, "Invalid phone number format");
    }
  }

  // Cek apakah kontak ada
  const contact = await prismaClient.contact.findFirst({
    where: {
      id: contactId,
      userEmail: user.email,
    },
  });

  // Jika kontak tidak ditemukan, throw error
  if (!contact) {
    throw new ResponseError(404, "Contact not found");
  }

  // Cek apakah email sudah terdaftar untuk user yang sama (kecuali untuk kontak yang sedang diupdate)
  if (email !== contact.email) {
    const existingContact = await prismaClient.contact.findFirst({
      where: {
        email: email,
        userEmail: user.email,
      },
    });

    if (existingContact) {
      throw new ResponseError(400, "Email already exists");
    }
  }

  // Update kontak
  const result = await prismaClient.contact.update({
    where: {
      id: contactId,
    },
    data: {
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
    },
  });

  return result;
};

// Fungsi untuk menghapus kontak berdasarkan ID
const removeContact = async (user, contactId) => {
  // Validasi ID kontak
  if (!contactId || isNaN(contactId)) {
    throw new ResponseError(400, "Invalid contact ID");
  }

  // Cek apakah kontak ada
  const contact = await prismaClient.contact.findFirst({
    where: {
      id: contactId,
      userEmail: user.email,
    },
  });

  // Jika kontak tidak ditemukan, throw error
  if (!contact) {
    throw new ResponseError(404, "Contact not found");
  }

  // Hapus kontak
  await prismaClient.contact.delete({
    where: {
      id: contactId,
    },
  });
};

export default {
  createContact,
  getContact,
  getContacts,
  searchContacts,
  updateContact,
  removeContact,
};
