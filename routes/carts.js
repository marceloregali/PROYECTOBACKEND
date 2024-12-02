import express from "express";
import Cart from "../models/cart.js"; // Asegúrate de que esta ruta esté correcta.
const router = express.Router();

// Mostrar carrito
router.get("/:cid", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }
    res.render("cart", { cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el carrito" });
  }
});

export default router;
