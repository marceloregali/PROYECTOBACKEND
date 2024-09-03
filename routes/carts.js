import express from "express";
const router = express.Router();

const carritos = [
  { id: 1, productos: [] },
  { id: 2, productos: [] },
];

// obtener todos los carritos
router.get("/", (req, res) => {
  res.json(carritos);
});

// obtiene un carrito por ID
router.get("/:id", (req, res) => {
  const id = +req.params.id;
  const carrito = carritos.find((c) => c.id === id);
  if (!carrito) {
    return res
      .status(404)
      .json({ message: `Carrito con ID ${id} no encontrado` });
  }
  res.json(carrito);
});

//agrega un producto
router.post("/:id/productos", (req, res) => {
  const id = +req.params.id;
  const carrito = carritos.find((c) => c.id === id);
  if (!carrito) {
    return res
      .status(404)
      .json({ message: `Carrito con ID ${id} no encontrado` });
  }

  const producto = req.body;

  if (!producto.id || !producto.title || !producto.price) {
    return res.status(400).json({ message: "Datos del producto incompletos" });
  }

  carrito.productos.push(producto);
  res.status(201).json({ message: "Producto agregado al carrito", carrito });
});

// elimina un producto
router.delete("/:id/productos/:pid", (req, res) => {
  const id = +req.params.id;
  const pid = +req.params.pid;
  const carrito = carritos.find((c) => c.id === id);
  if (!carrito) {
    return res
      .status(404)
      .json({ message: `Carrito con ID ${id} no encontrado` });
  }
  carrito.productos = carrito.productos.filter((p) => p.id !== pid);
  res.json({ message: "Producto eliminado del carrito", carrito });
});

export default router;
