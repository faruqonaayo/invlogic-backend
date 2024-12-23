// 3rd party modules
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

// custom modules
import serverResponse from "./utils/serverResponse.js";
import authRoutes from "./routes/auth.js";

// express app
const app = express();

// loading environment variables to process.env
dotenv.config();

// constants
const PORT = process.env.PORT || 3000;
const DB_URI = process.env.DB_URI;
const DB_NAME = process.env.DB_NAME;

// connection to db
mongoose.connect(DB_URI, { dbName: DB_NAME });

// using 3rd party middleware
app.use(cors());
app.use(bodyParser.json());

// API home route middleware
app.get("/", (req, res, next) => {
  return serverResponse(res, 200, "Welcome to Invlogic backend API", {
    additionalMessage: "This API was developed by Faruq Ayomide",
  });
});

// other routes middleware
app.use("/api/auth", authRoutes);

// route not found middleware
app.use((req, res, next) => {
  return serverResponse(res, 404, "Route Not Found");
});

// server error middleware
app.use((error, req, res, next) => {
  console.log(error);
  return serverResponse(res, 500, "Internal Server Error");
});

// server listening
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
