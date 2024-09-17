import express from "express";
import fs from "fs/promises";
const router = express.Router();
const filePath = "./database/productos.json";

//  Los productos
const getProductos = async () => {
  const data = await fs.readFile(filePath, "utf8");
  return JSON.parse(data);
};

// Guardo los productos
const saveProductos = async (productos) => {
  await fs.writeFile(filePath, JSON.stringify(productos, null, 2));
};

// Obtengo productos
router.get("/", async (req, res) => {
  try {
    const productos = await getProductos();
    res.json(productos);
  } catch (err) {
    res.status(500).json({ message: "Error al leer los productos" });
  }
});

// Obtengo  un producto por ID
router.get("/:id", async (req, res) => {
  try {
    const productos = await getProductos();
    const id = +req.params.id;
    const producto = productos.find((p) => p.id === id);
    if (!producto) {
      return res
        .status(404)
        .json({ message: `Producto con ID ${id} no encontrado` });
    }
    res.json(producto);
  } catch (err) {
    res.status(500).json({ message: "Error al leer el producto" });
  }
});

// Agrego un nuevo producto
router.post("/", async (req, res) => {
  try {
    const productos = await getProductos();
    const nuevoProducto = req.body;
    // Genero un nuevo ID (único)
    const nuevoId =
      productos.length > 0 ? Math.max(productos.map((p) => p.id)) + 1 : 1;
    if (!nuevoProducto.title || !nuevoProducto.price) {
      return res
        .status(400)
        .json({ message: "Datos del producto incompletos" });
    }

    nuevoProducto.id = nuevoId;
    productos.push(nuevoProducto);
    await saveProductos(productos);
    res.status(201).json({ message: "Producto agregado", nuevoProducto });
  } catch (err) {
    res.status(500).json({ message: "Error al agregar producto" });
  }
});

// Elimino un producto
router.delete("/:id", async (req, res) => {
  try {
    const productos = await getProductos();
    const id = +req.params.id;
    const index = productos.findIndex((p) => p.id === id);
    if (index === -1) {
      return res
        .status(404)
        .json({ message: `Producto con ID ${id} no encontrado` });
    }

    productos.splice(index, 1);
    await saveProductos(productos);
    res.json({ message: "Producto eliminado" });
  } catch (err) {
    res.status(500).json({ message: "Error al eliminar producto" });
  }
});

export default router;
