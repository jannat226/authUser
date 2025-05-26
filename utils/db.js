import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
// export a function that connects to mongoDBß
const db = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("connected to mongoDB");
    })
    .catch((err) => {
      console.log("Error connecting to mongoDB");
    });
};
export default db;
