import express from "express";

const router = express.Router();

// Ruta principal que renderiza la vista 'index'
router.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

export default router;
