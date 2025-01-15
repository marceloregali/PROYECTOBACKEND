import express from "express";
import { purchase } from "../controllers/checkout.controller.js";
import { authenticateToken } from "../middlewares/auth.js";

const router = express.Router();

router.post("/purchase", authenticateToken, purchase);

export default router;
