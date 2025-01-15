import express from "express";
import { createTicket } from "../controllers/ticket.controller.js";
import { authenticateToken } from "../middlewares/auth.js"; // Para asegurar que el usuario está autenticado

const router = express.Router();

// Ruta para crear un ticket
router.post("/", authenticateToken, createTicket);

export default router;
