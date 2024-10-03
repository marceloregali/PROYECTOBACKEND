import express from "express";
import fs from "fs/promises";
import Cart from "../models/cart.js"; // Asegúrate de que la ruta sea correcta
import Product from "../models/product.js"; // Asegúrate de que la ruta sea correcta

const router = express.Router();

// Crear un nuevo carrito
router.post("/", async (req, res) => {
  try {
    const newCart = new Cart();
    await newCart.save();
    res.status(201).json({ message: "Carrito creado", carrito: newCart });
  } catch (error) {
    res.status(500).json({ message: "Error al crear carrito" });
  }
});

// Agregar un producto al carrito
router.post("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  try {
    const carrito = await Cart.findById(cid);

    if (!carrito) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    carrito.addProduct(pid, quantity);
    res.json({ message: "Producto agregado al carrito", carrito });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al agregar producto", error: error.message });
  }
});

// Eliminar un producto del carrito
router.delete("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;

  try {
    const carrito = await Cart.findById(cid);

    if (!carrito) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    carrito.removeProduct(pid);
    res.json({ message: "Producto eliminado del carrito", carrito });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar producto", error: error.message });
  }
});

// Obtener todos los productos de un carrito
router.get("/:cid", async (req, res) => {
  const { cid } = req.params;

  try {
    const carrito = await Cart.findById(cid).populate("productos.product"); // Población para obtener detalles del producto

    if (!carrito) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    res.json(carrito);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener carrito", error: error.message });
  }
});

// Eliminar todos los productos del carrito
router.delete("/:cid", async (req, res) => {
  const { cid } = req.params;

  try {
    const carrito = await Cart.findById(cid);

    if (!carrito) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    await carrito.emptyCart();
    res.json({ message: "Todos los productos eliminados del carrito" });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error al eliminar productos del carrito",
        error: error.message,
      });
  }
});

// Actualizar un carrito con un arreglo de productos
router.put("/:cid", async (req, res) => {
  const { cid } = req.params;
  const { productos } = req.body;

  try {
    const carrito = await Cart.findById(cid);

    if (!carrito) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    carrito.productos = productos.map((item) => ({
      product: item.product, // Asegúrate de que este sea un ObjectId válido
      quantity: item.quantity,
    }));

    await carrito.save();
    res.json({ message: "Carrito actualizado", carrito });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar carrito", error: error.message });
  }
});

// Actualizar solo la cantidad de un producto en el carrito
router.put("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  try {
    const carrito = await Cart.findById(cid);

    if (!carrito) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    const producto = carrito.productos.find(
      (p) => p.product.toString() === pid
    );

    if (!producto) {
      return res
        .status(404)
        .json({ message: "Producto no encontrado en el carrito" });
    }

    producto.quantity = quantity;
    await carrito.save();
    res.json({ message: "Cantidad de producto actualizada", carrito });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error al actualizar cantidad de producto",
        error: error.message,
      });
  }
});

export default router;
