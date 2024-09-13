import { Router } from "express";
const router = Router();

router.get("/home", async (req, res) => {
  try {
    // Obtener la lista de productos desde la API
    const response = await fetch("http://localhost:8080/api/products");
    const productos = await response.json();
    // Renderizar la vista 'home.handlebars' con los productos
    res.render("home", { productos });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).send("Error al obtener productos");
  }
});

router.get("/realtimeproducts", (req, res) => {
  res.render("realtimeproducts");
});

export default router;
