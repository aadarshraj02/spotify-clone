import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.send("Stat route check!");
});

export default router;
