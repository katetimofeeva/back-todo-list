import mongoose from "mongoose";
import { configAPP } from "./config.js";

const Mongoose = () => {
  console.log(process.env.COLLECTION);
  mongoose
    .connect(configAPP.DB_HOST, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    .then(() => {
      console.log("connect");
      const db = mongoose.connection;
    })
    .catch((e) => {
      console.log(e);
      process.exit(1);
    });
};

export default Mongoose;
