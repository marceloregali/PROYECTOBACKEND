import { Router } from "express";
import fetch from "node-fetch";

const router = Router();

// Productos paginados
router.get("/products", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const response = await fetch(
      `http://localhost:8080/api/products?page=${page}&limit=${limit}`
    );
    const productos = await response.json();

    res.render("index", {
      productos: productos.payload,
      page: productos.page,
      hasPrevPage: productos.hasPrevPage,
      hasNextPage: productos.hasNextPage,
      prevLink: productos.prevLink,
      nextLink: productos.nextLink,
    });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).send("Error al obtener productos");
  }
});

// Ver un producto específico
router.get("/products/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const response = await fetch(`http://localhost:8080/api/products/${pid}`);
    const producto = await response.json();

    if (producto.status === "error") {
      return res.status(404).send("Producto no encontrado");
    }

    res.render("productDetail", { producto: producto.payload });
  } catch (error) {
    console.error("Error al obtener producto:", error);
    res.status(500).send("Error al obtener producto");
  }
});

// Ver un carrito específico
router.get("/carts/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const response = await fetch(`http://localhost:8080/api/carts/${cid}`);
    const carrito = await response.json();

    if (carrito.status === "error") {
      return res.status(404).send("Carrito no encontrado");
    }

    res.render("cartDetail", { carrito: carrito.payload });
  } catch (error) {
    console.error("Error al obtener carrito:", error);
    res.status(500).send("Error al obtener carrito");
  }
});

// Página principal
router.get("/home", async (req, res) => {
  try {
    const response = await fetch("http://localhost:8080/api/products");
    const productos = await response.json();

    res.render("home", { productos });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).send("Error al obtener productos");
  }
});

// Página de productos en tiempo real
router.get("/realtimeproducts", (req, res) => {
  res.render("realtimeproducts");
});

export default router;
