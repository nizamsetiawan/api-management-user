import express from "express";
import { router } from "./route/api.js";
import { errorMiddleware } from "./middleware/error-middleware.js";

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use(router);

// Error handling middleware
app.use(errorMiddleware);

// Start server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
