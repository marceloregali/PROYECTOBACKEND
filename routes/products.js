import express from "express";
import Product from "../models/product.js";

const router = express.Router();

// Obtengo los productos desde MongoDB con limit, page, sort y query
router.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      sort: sort ? { price: sort === "asc" ? 1 : -1 } : {},
    };

    // Filtro por categoría o si hay disponible
    const filters = {};
    if (query) {
      filters.$or = [
        { category: new RegExp(query, "i") },
        { available: query },
      ];
    }

    const productos = await Product.paginate(filters, options);

    res.json({
      status: "success",
      payload: productos.docs,
      totalPages: productos.totalPages,
      page: productos.page,
      hasPrevPage: productos.hasPrevPage,
      hasNextPage: productos.hasNextPage,
      prevPage: productos.prevPage,
      nextPage: productos.nextPage,
    });
  } catch (err) {
    res
      .status(500)
      .json({ status: "error", message: "Error al leer los productos" });
  }
});

// Obtengo un producto por ID desde MongoDB
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
    res
      .status(500)
      .json({ status: "error", message: "Error al leer el producto" });
  }
});

// Agrego un nuevo producto a la base de datos de MongoDB
router.post("/", async (req, res) => {
  try {
    const nuevoProducto = new Product(req.body);

    // Guardo el producto en la base de datos
    await nuevoProducto.save();

    res.status(201).json({
      status: "success",
      message: "Producto agregado",
      payload: nuevoProducto,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Error al agregar producto",
      error: err.message,
    });
  }
});

// Elimino un producto por ID desde MongoDB
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
    res.status(500).json({
      status: "error",
      message: "Error al eliminar producto",
    });
  }
});

export default router;
