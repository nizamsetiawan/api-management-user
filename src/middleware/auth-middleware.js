import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response.error.js";

const authMiddleware = async (req, res, next) => {
  try {
    // Ambil token dari header Authorization
    const token = req.get("Authorization");
    // Jika token tidak ada, lewati ke error handler middleware
    if (!token) {
      throw new ResponseError(401, "Unauthorized");
    }

    // Hapus "Bearer " dari token jika ada
    const tokenValue = token.replace("Bearer ", "");

    // Cari user berdasarkan token
    const user = await prismaClient.user.findFirst({
      // Cari user berdasarkan token
      where: {
        token: tokenValue,
      },
    });

    // Jika user tidak ditemukan, lewati ke error handler middleware
    if (!user) {
      throw new ResponseError(401, "Unauthorized");
    }

    // Tambahkan informasi user ke request
    req.user = user;
    // Lanjutkan ke middleware berikutnya
    next();
  } catch (error) {
    next(error);
  }
};

export { authMiddleware }; 