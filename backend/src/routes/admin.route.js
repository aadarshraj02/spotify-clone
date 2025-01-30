import { Router } from "express";
import {
  createAlbum,
  createSong,
  deleteAlbum,
  deleteSong,
} from "../controller/admin.controller.js";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/check", protectRoute, requireAdmin, checkAdmin);

router.post("/songs", protectRoute, requireAdmin, createSong);
router.delete("/songs/:id", protectRoute, requireAdmin, deleteSong);

router.post("/album", protectRoute, requireAdmin, createAlbum);
router.delete("/album/:id", protectRoute, requireAdmin, deleteAlbum);

export default router;
