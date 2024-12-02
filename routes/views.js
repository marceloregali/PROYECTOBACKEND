import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index", { title: "Inicio" });
});

router.get("/realtimeproducts", async (req, res) => {
  res.render("realTimeProducts", { title: "Productos en Tiempo Real" });
});

export default router;
