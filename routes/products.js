import express from "express";
import { authenticateToken, authorizeRole } from "../middlewars/auth.js";
import ProductService from "../services/product.service.js";

const router = express.Router();

// Creo un  producto (sólo administrador)
router.post(
  "/",
  authenticateToken,
  authorizeRole("admin"),
  async (req, res) => {
    try {
      const product = await ProductService.createProduct(req.body);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Actualizo el  producto (sólo administrador)
router.put(
  "/:id",
  authenticateToken,
  authorizeRole("admin"),
  async (req, res) => {
    try {
      const updatedProduct = await ProductService.updateProduct(
        req.params.id,
        req.body
      );
      if (!updatedProduct) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }
      res.json(updatedProduct);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Elimino el  producto (sólo administrador)
router.delete(
  "/:id",
  authenticateToken,
  authorizeRole("admin"),
  async (req, res) => {
    try {
      const deletedProduct = await ProductService.deleteProduct(req.params.id);
      if (!deletedProduct) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }
      res.json({ message: "Producto eliminado con éxito" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

export default router;
