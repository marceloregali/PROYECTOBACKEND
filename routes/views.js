import { Router } from "express";
import fetch from "node-fetch";

const router = Router();

// Productos paginados
router.get("/products", async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const response = await fetch(
      `http://localhost:8080/api/products?page=${page}&limit=${limit}`
    );

    if (!response.ok) {
      throw new Error("Error en la respuesta de la API");
    }

    const productos = await response.json();
    res.render("index", {
      productos: productos.payload,
      page: productos.page,
      hasPrevPage: productos.hasPrevPage,
      hasNextPage: productos.hasNextPage,
      prevLink: productos.prevPage
        ? `/products?page=${productos.prevPage}&limit=${limit}`
        : null,
      nextLink: productos.nextPage
        ? `/products?page=${productos.nextPage}&limit=${limit}`
        : null,
    });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    next(error);
  }
});

// Ver un producto específico
router.get("/products/:pid", async (req, res, next) => {
  try {
    const { pid } = req.params;
    const response = await fetch(`http://localhost:8080/api/products/${pid}`);

    if (!response.ok) {
      throw new Error("Error en la respuesta de la API");
    }

    const producto = await response.json();

    if (!producto || producto.status === "error") {
      return res.status(404).send("Producto no encontrado");
    }

    res.render("productDetail", { producto: producto.payload });
  } catch (error) {
    console.error("Error al obtener producto:", error);
    next(error);
  }
});

// Ver un carrito específico
router.get("/carts/:cid", async (req, res, next) => {
  try {
    const { cid } = req.params;
    const response = await fetch(`http://localhost:8080/api/carts/${cid}`);

    if (!response.ok) {
      throw new Error("Error en la respuesta de la API");
    }

    const carrito = await response.json();

    if (!carrito || carrito.status === "error") {
      return res.status(404).send("Carrito no encontrado");
    }

    res.render("cartDetail", { carrito: carrito.payload });
  } catch (error) {
    console.error("Error al obtener carrito:", error);
    next(error);
  }
});

// Página principal (home)
router.get("/home", async (req, res, next) => {
  try {
    const response = await fetch("http://localhost:8080/api/products");

    if (!response.ok) {
      throw new Error("Error en la respuesta de la API");
    }

    const productos = await response.json();
    res.render("home", { productos: productos.payload || [] });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    next(error);
  }
});

// Productos en tiempo real
router.get("/realtimeproducts", (req, res) => {
  res.render("realtimeproducts");
});

export default router;
