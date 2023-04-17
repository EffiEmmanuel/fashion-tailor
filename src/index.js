// @ts-nocheck
import express, { json, urlencoded } from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import userRouter from "./router/userRouter.js";
import tailorRouter from "./router/tailorRouter.js";
import productRouter from "./router/productRouter.js";

dotenv.config();

const app = express();

// Middewares
app.use(
  cors({
    origin: "*",
  })
);
app.use(urlencoded({ extended: false, limit: "50mb" }));
app.use(json());

// Connect to database
connectDB();

// Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tailors", tailorRouter);
app.use("/api/v1/products", productRouter);

// Creating the server
const server = http.createServer(app);

// Set up server to listen on specified port number
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
