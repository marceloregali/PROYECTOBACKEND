import express from "express";
import fs from "fs/promises";
const router = express.Router();
const filePath = "./database/carritos.json";

//  leer los carritos
const getCarritos = async () => {
  const data = await fs.readFile(filePath, "utf8");
  return JSON.parse(data);
};

//  guardar los carritos
const saveCarritos = async (carritos) => {
  await fs.writeFile(filePath, JSON.stringify(carritos, null, 2));
};

// Obtener todos los carritos
router.get("/", async (req, res) => {
  try {
    const carritos = await getCarritos();
    res.json(carritos);
  } catch (err) {
    res.status(500).json({ message: "Error al leer los carritos" });
  }
});

// Obtener un carrito por ID
router.get("/:id", async (req, res) => {
  try {
    const carritos = await getCarritos();
    const id = +req.params.id;
    const carrito = carritos.find((c) => c.id === id);
    if (!carrito) {
      return res
        .status(404)
        .json({ message: `Carrito con ID ${id} no encontrado` });
    }
    res.json(carrito);
  } catch (err) {
    res.status(500).json({ message: "Error al leer el carrito" });
  }
});

// Agregar un producto
router.post("/:id/productos", async (req, res) => {
  try {
    const carritos = await getCarritos();
    const id = +req.params.id;
    const carrito = carritos.find((c) => c.id === id);
    if (!carrito) {
      return res
        .status(404)
        .json({ message: `Carrito con ID ${id} no encontrado` });
    }

    const producto = req.body;
    if (!producto.id || !producto.title || !producto.price) {
      return res
        .status(400)
        .json({ message: "Datos del producto incompletos" });
    }

    carrito.productos.push(producto);
    await saveCarritos(carritos);
    res.status(201).json({ message: "Producto agregado al carrito", carrito });
  } catch (err) {
    res.status(500).json({ message: "Error al agregar producto al carrito" });
  }
});

// Eliminar un producto
router.delete("/:id/productos/:pid", async (req, res) => {
  try {
    const carritos = await getCarritos();
    const id = +req.params.id;
    const pid = +req.params.pid;
    const carrito = carritos.find((c) => c.id === id);
    if (!carrito) {
      return res
        .status(404)
        .json({ message: `Carrito con ID ${id} no encontrado` });
    }

    carrito.productos = carrito.productos.filter((p) => p.id !== pid);
    await saveCarritos(carritos);
    res.json({ message: "Producto eliminado del carrito", carrito });
  } catch (err) {
    res.status(500).json({ message: "Error al eliminar producto del carrito" });
  }
});

export default router;
