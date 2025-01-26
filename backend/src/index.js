import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoute.js";
import adminRoutes from "./routes/adminRoute.js";
import authRoutes from "./routes/songRoute.js";
import songRoutes from "./routes/songRoute.js";
import albumRoutes from "./routes/albumRoute.js";
import statRoutes from "./routes/statRoute.js";
import cors from "cors";

dotenv.config();

const app = express();

const PORT = process.env.PORT;

app.use(express.json());

app.use(cors());

app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/stats", statRoutes);

app.listen(PORT, () => {
  console.log("Server is running");
});
