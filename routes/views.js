import { Router } from "express";
import fetch from "node-fetch";

const router = Router();

//  (productos paginados)
router.get("/products", async (req, res) => {
  try {
    // Obtengo los productos con paginación
    const { page = 1, limit = 10 } = req.query;
    const response = await fetch(
      `http://localhost:8080/api/products?page=${page}&limit=${limit}`
    );
    const productos = await response.json();

    // Renderizar la vista con los productos paginados
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

// Veo un  un producto específico
router.get("/products/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const response = await fetch(`http://localhost:8080/api/products/${pid}`);
    const producto = await response.json();

    if (producto.status === "error") {
      return res.status(404).send("Producto no encontrado");
    }

    // Renderizo la vista del producto
    res.render("productDetail", { producto: producto.payload });
  } catch (error) {
    console.error("Error al obtener producto:", error);
    res.status(500).send("Error al obtener producto");
  }
});

// Veo un carrito específico
router.get("/carts/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const response = await fetch(`http://localhost:8080/api/carts/${cid}`);
    const carrito = await response.json();

    if (carrito.status === "error") {
      return res.status(404).send("Carrito no encontrado");
    }

    // Renderizo la vista del carrito específico
    res.render("cartDetail", { carrito: carrito.payload });
  } catch (error) {
    console.error("Error al obtener carrito:", error);
    res.status(500).send("Error al obtener carrito");
  }
});

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

/*import { Router } from "express";
import fetch from "node-fetch";

const router = Router();

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

router.get("/realtimeproducts", (req, res) => {
  res.render("realtimeproducts");
});

export default router;*/
