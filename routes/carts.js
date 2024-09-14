import express from "express";
import fs from "fs/promises";

const router = express.Router();
const filePath = "./database/carritos.json";

//  leer los carritos
const getCarritos = async () => {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error leyendo el archivo de carritos:", error);
    throw new Error("No se pudo leer el archivo de carritos");
  }
};

//  guardar los carritos
const saveCarritos = async (carritos) => {
  try {
    await fs.writeFile(filePath, JSON.stringify(carritos, null, 2));
  } catch (error) {
    console.error("Error guardando los carritos:", error);
    throw new Error("No se pudo guardar el archivo de carritos");
  }
};

//  crear un nuevo carrito
router.post("/", async (req, res) => {
  try {
    const carritos = await getCarritos();
    const newCarrito = {
      id: carritos.length + 1,
      productos: [],
    };
    carritos.push(newCarrito);
    await saveCarritos(carritos);
    res.status(201).json({ message: "Carrito creado", carrito: newCarrito });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear carrito", error: error.message });
  }
});

// agregar un producto a un carrito
router.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  try {
    const carritos = await getCarritos();
    const carrito = carritos.find((c) => c.id === parseInt(cid));

    if (!carrito) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    const productoExistente = carrito.productos.find(
      (p) => p.id === parseInt(pid)
    );

    if (productoExistente) {
      productoExistente.quantity += quantity;
    } else {
      carrito.productos.push({ id: parseInt(pid), quantity });
    }

    await saveCarritos(carritos);
    res.json({ message: "Producto agregado al carrito", carrito });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al agregar producto", error: error.message });
  }
});

//  eliminar un producto de un carrito
router.delete("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;

  try {
    const carritos = await getCarritos();
    const carrito = carritos.find((c) => c.id === parseInt(cid));

    if (!carrito) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    carrito.productos = carrito.productos.filter((p) => p.id !== parseInt(pid));

    await saveCarritos(carritos);
    res.json({ message: "Producto eliminado del carrito", carrito });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar producto", error: error.message });
  }
});

// obtener los productos de un carrito
router.get("/:cid", async (req, res) => {
  const { cid } = req.params;

  try {
    const carritos = await getCarritos();
    const carrito = carritos.find((c) => c.id === parseInt(cid));

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

export default router;
