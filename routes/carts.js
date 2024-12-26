import express from "express";
import Ticket from "../models/ticket.js";
import Cart from "../models/cart.js"; // Modelo de carrito
import Product from "../models/product.js"; // Modelo de producto
import { authenticateToken } from "../middlewars/auth.js";

const router = express.Router();

// Endpoint para finalizar la compra
router.post("/:cid/purchase", authenticateToken, async (req, res) => {
  try {
    const { cid } = req.params;
    const userEmail = req.user.email; // Obtenemos el email del usuario autenticado

    // Buscar el carrito por ID
    const cart = await Cart.findById(cid).populate("products.product");
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    let totalAmount = 0;
    const purchasedProducts = [];
    const failedProducts = [];

    // Iterar sobre los productos del carrito
    for (const item of cart.products) {
      if (item.product.stock >= item.quantity) {
        totalAmount += item.product.price * item.quantity;

        // Reducir el stock del producto
        item.product.stock -= item.quantity;
        await item.product.save();

        // Agregar a la lista de productos comprados
        purchasedProducts.push({
          productId: item.product._id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
        });
      } else {
        // Agregar a la lista de productos sin stock suficiente
        failedProducts.push(item.product._id);
      }
    }

    // Generar el ticket solo si se compraron productos
    let ticket = null;
    if (purchasedProducts.length > 0) {
      ticket = new Ticket({
        amount: totalAmount,
        purchaser: userEmail,
      });
      await ticket.save();
    }

    // Actualizar el carrito, manteniendo solo los productos que no se pudieron comprar
    cart.products = cart.products.filter((item) =>
      failedProducts.includes(item.product._id)
    );
    await cart.save();

    res.status(200).json({
      message: "Compra procesada",
      ticket,
      purchasedProducts,
      failedProducts, // IDs de los productos no procesados
      remainingCart: cart.products, // Productos que permanecen en el carrito
    });
  } catch (error) {
    console.error("Error al finalizar la compra:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
