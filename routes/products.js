import express from "express";
import Product from "../models/product.js";

const router = express.Router();

// Obtener productos con limit, page, sort y query
router.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      sort: sort ? { price: sort === "asc" ? 1 : -1 } : {},
    };

    // Filtro por categoría o disponibilidad
    const filters = {};
    if (query) {
      filters.$or = [
        { category: new RegExp(query, "i") },
        { available: query === "true" }, // Filtro por disponibilidad
      ];
    }

    const productos = await Product.paginate(filters, options);

    // Log para depuración
    console.log("Productos obtenidos de MongoDB:", productos);

    res.json({
      status: "success",
      payload: productos.docs,
      totalPages: productos.totalPages,
      page: productos.page,
      hasPrevPage: productos.hasPrevPage,
      hasNextPage: productos.hasNextPage,
      prevPage: productos.prevPage || null, // Prevención de valores null
      nextPage: productos.nextPage || null, // Prevención de valores null
    });
  } catch (err) {
    console.error("Error al obtener productos:", err);
    res
      .status(500)
      .json({ status: "error", message: "Error al leer los productos" });
  }
});

// Obtener producto por ID
router.get("/:id", async (req, res) => {
  try {
    const producto = await Product.findById(req.params.id);
    if (!producto) {
      return res.status(404).json({
        status: "error",
        message: `Producto con ID ${req.params.id} no encontrado`,
      });
    }
    res.json({ status: "success", payload: producto });
  } catch (err) {
    console.error("Error al obtener producto:", err);
    res
      .status(500)
      .json({ status: "error", message: "Error al leer el producto" });
  }
});

// Agregar un nuevo producto
router.post("/", async (req, res) => {
  try {
    const nuevoProducto = new Product(req.body);
    await nuevoProducto.save();

    res.status(201).json({
      status: "success",
      message: "Producto agregado",
      payload: nuevoProducto,
    });
  } catch (err) {
    console.error("Error al agregar producto:", err);
    res.status(500).json({
      status: "error",
      message: "Error al agregar producto",
      error: err.message,
    });
  }
});

// Eliminar un producto por ID
router.delete("/:id", async (req, res) => {
  try {
    const producto = await Product.findByIdAndDelete(req.params.id);
    if (!producto) {
      return res.status(404).json({
        status: "error",
        message: `Producto con ID ${req.params.id} no encontrado`,
      });
    }
    res.json({ status: "success", message: "Producto eliminado" });
  } catch (err) {
    console.error("Error al eliminar producto:", err);
    res.status(500).json({
      status: "error",
      message: "Error al eliminar producto",
    });
  }
});

export default router;
