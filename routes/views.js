import { Router } from "express";
import path from "path";

const router = Router();

// Ruta para mostrar el formulario de registro
router.get("/register", (req, res) => {
  res.render("register");
});

// Ruta para mostrar el formulario de login
router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/auth", (req, res) => {
  res.render("auth");
});

router.get("/auth.html", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "auth.html"));
});

export default router;
