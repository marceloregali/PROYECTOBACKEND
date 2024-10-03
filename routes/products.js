import express from "express";
import fs from "fs/promises";
import Product from "../models/product.js";

const router = express.Router();
const filePath = "./database/productos.json";

// Obtener productos desde el archivo JSON
const getProductos = async () => {
  const data = await fs.readFile(filePath, "utf8");
  return JSON.parse(data);
};

// Guardar productos en el archivo JSON
const saveProductos = async (productos) => {
  await fs.writeFile(filePath, JSON.stringify(productos, null, 2));
};

// Uso el metodo GET con limit, page, sort y query
router.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
    const productos = await getProductos();

    // Filtro por categoría o disponibilidad
    let filteredProductos = productos;
    if (query) {
      filteredProductos = productos.filter(
        (p) =>
          p.category?.toLowerCase().includes(query.toLowerCase()) ||
          p.available?.toString() === query
      );
    }

    // Ordeno ascendente o descendente por precio
    if (sort) {
      const sortOrder = sort === "asc" ? 1 : -1;
      filteredProductos.sort((a, b) => (a.price - b.price) * sortOrder);
    }

    // Paginación
    const totalItems = filteredProductos.length;
    const totalPages = Math.ceil(totalItems / limit);
    const currentPage = Math.max(1, Math.min(page, totalPages));
    const startIndex = (currentPage - 1) * limit;
    const paginatedProductos = filteredProductos.slice(
      startIndex,
      startIndex + parseInt(limit)
    );

    // Da un resultado en el fomato que se pide
    const result = {
      status: "success",
      payload: paginatedProductos,
      totalPages,
      prevPage: currentPage > 1 ? currentPage - 1 : null,
      nextPage: currentPage < totalPages ? currentPage + 1 : null,
      page: currentPage,
      hasPrevPage: currentPage > 1,
      hasNextPage: currentPage < totalPages,
      prevLink:
        currentPage > 1
          ? `/api/products?limit=${limit}&page=${
              currentPage - 1
            }&sort=${sort}&query=${query}`
          : null,
      nextLink:
        currentPage < totalPages
          ? `/api/products?limit=${limit}&page=${
              currentPage + 1
            }&sort=${sort}&query=${query}`
          : null,
    };

    res.json(result);
  } catch (err) {
    res
      .status(500)
      .json({ status: "error", message: "Error al leer los productos" });
  }
});

// Utilizo el metodo GET producto por ID
router.get("/:id", async (req, res) => {
  try {
    const productos = await getProductos();
    const id = +req.params.id;
    const producto = productos.find((p) => p.id === id);
    if (!producto) {
      return res.status(404).json({
        status: "error",
        message: `Producto con ID ${id} no encontrado`,
      });
    }
    res.json({ status: "success", payload: producto });
  } catch (err) {
    res
      .status(500)
      .json({ status: "error", message: "Error al leer el producto" });
  }
});

// POST agregar 1 nuevo producto a la base de datos de MongoDB
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

// Eliminar un producto
router.delete("/:id", async (req, res) => {
  try {
    const productos = await getProductos();
    const id = +req.params.id;
    const index = productos.findIndex((p) => p.id === id);
    if (index === -1) {
      return res.status(404).json({
        status: "error",
        message: `Producto con ID ${id} no encontrado`,
      });
    }

    productos.splice(index, 1);
    await saveProductos(productos);
    res.json({ status: "success", message: "Producto eliminado" });
  } catch (err) {
    res
      .status(500)
      .json({ status: "error", message: "Error al eliminar producto" });
  }
});

export default router;
