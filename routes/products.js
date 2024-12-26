import express from "express";
import { authenticateToken, authorizeRole } from "../middlewars/auth.js";
import Product from "../models/product.js";

const router = express.Router();

// Crear producto (sólo administrador)
router.post(
  "/",
  authenticateToken,
  authorizeRole("admin"), // Verifica que el usuario sea administrador
  async (req, res) => {
    try {
      const product = new Product(req.body);
      await product.save();
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Actualizar producto (sólo administrador)
router.put(
  "/:id",
  authenticateToken,
  authorizeRole("admin"), // Verifica que el usuario sea administrador
  async (req, res) => {
    try {
      const { id } = req.params;
      const product = await Product.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      if (!product) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }
      res.json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Eliminar producto (sólo administrador)
router.delete(
  "/:id",
  authenticateToken,
  authorizeRole("admin"), // Verifica que el usuario sea administrador
  async (req, res) => {
    try {
      const { id } = req.params;
      const product = await Product.findByIdAndDelete(id);
      if (!product) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }
      res.json({ message: "Producto eliminado con éxito" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

export default router;
