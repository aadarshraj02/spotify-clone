import { Router } from "express";

const router = Router();

router.get("/",(req,res)=>{
    res.send("User route check!")
})

export default router;