// Import dependencies yang diperlukan
import express from "express";
import { router } from "../route/api.js";
import { errorMiddleware } from "../middleware/error-middleware.js";

// Buat instance Express
const web = express();

// Middleware untuk parsing JSON
web.use(express.json());

// Daftarkan semua route
web.use(router);

// Middleware untuk handling error
web.use(errorMiddleware);

export { web };
