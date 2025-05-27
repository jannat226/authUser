// Expres is a lightweight webdev framework  for node.js.It's used to build web servers,RESTful APIs, and backend logic for full-stack apps
import express from "express";
// dotenv loads .env varaible into process.env
import dotenv from "dotenv";
// If dotenv is not at root but instead somewhere else
import cors from "cors";

import db from "./utils/db.js";

// import all routes
import userRoutes from "./routes/user.routes.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express(); // initialization

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const port = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.get("/hi", (req, res) => {
  res.send("HEy Jenny");
});
console.log(process.env.PORT);
// connect to db
db();
//user routes
app.use("/api/v1/users", userRoutes);

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });

app.listen(4000, () => {
  console.log("Server listening on port 4000");
});
