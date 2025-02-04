import { Router } from "express";
import { getAlbumsById, getAllAlbums } from "../controller/album.controller.js";

const router = Router();

router.get("/", getAllAlbums);
router.get("/:albumId", getAlbumsById);

export default router;
