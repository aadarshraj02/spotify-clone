import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.send("Song route check!");
});

export default router;
