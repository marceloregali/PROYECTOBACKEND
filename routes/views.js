import { Router } from "express";
import fetch from "node-fetch";

const router = Router();

// Productos de los  paginados
router.get("/products", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const response = await fetch(
      `http://localhost:8080/api/products?page=${page}&limit=${limit}`
    );

    // Verifico  las respuestas
    if (!response.ok) {
      throw new Error("Error en la respuesta de la API");
    }

    const productos = await response.json();

    // depuración
    console.log("Productos obtenidos:", productos);

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

    // Verifico la respuesta
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
    res.status(500).send("Error al obtener producto");
  }
});

// Veo 1 carrito específico
router.get("/carts/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const response = await fetch(`http://localhost:8080/api/carts/${cid}`);

    // Verifico la respuesta
    if (!response.ok) {
      throw new Error("Error en la respuesta de la API");
    }

    const carrito = await response.json();

    // me aseguro de que el carrito tiene el campo esperado
    if (!carrito || carrito.status === "error") {
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

    // Verifico la respuesta
    if (!response.ok) {
      throw new Error("Error en la respuesta de la API");
    }

    const productos = await response.json();
    res.render("home", { productos: productos.payload || [] });
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
