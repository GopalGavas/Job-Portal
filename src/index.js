import dotenv from "dotenv";
import { app } from "./app.js";
import { connectDB } from "./database/db.js";

dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("Error! ", error);
    });

    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(`server is listining on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(`MongoDB connection failed!!! ${err}`);
    throw err;
  });
