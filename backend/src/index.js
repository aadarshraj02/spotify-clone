import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoute.js";
import cors from "cors";

dotenv.config();

const app = express();

const PORT = process.env.PORT;

app.use(express.json());

app.use(cors());

app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log("Server is running");
});
