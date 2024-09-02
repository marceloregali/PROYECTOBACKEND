import express from "express";
const router = express.Router();

const productos = [
  {
    id: 1,
    title: "Jeans",
    description: "Pelicula",
    code: 40,
    price: "$75000",
    status: true,
    stock: "23",
    category: "individual",
  },
  {
    id: 2,
    title: "Remeras",
    description: "Pelicula",
    code: 24,
    price: "$12500",
    status: true,
    stock: "23",
    category: "individual",
  },
  {
    id: 3,
    title: "Zapatillas",
    description: "Pelicula",
    code: 30,
    price: "$123500",
    status: true,
    stock: "23",
    category: "individual",
  },
];

//  todos los productos
router.get("/", (req, res) => {
  res.json(productos);
});

// obtener un producto por ID
router.get("/:id", (req, res) => {
  const id = +req.params.id;
  const producto = productos.find((p) => p.id === id);
  if (!producto) {
    return res
      .status(404)
      .json({ message: `Producto con ID ${id} no encontrado` });
  }
  res.json(producto);
});

//  agregar un nuevo producto
router.post("/", (req, res) => {
  const nuevoProducto = req.body;
  if (!nuevoProducto.id || !nuevoProducto.title || !nuevoProducto.price) {
    return res.status(400).json({ message: "Datos del producto incompletos" });
  }
  productos.push(nuevoProducto);
  res.status(201).json({ message: "Producto agregado", nuevoProducto });
});

// eliminar un producto
router.delete("/:id", (req, res) => {
  const id = +req.params.id;
  const index = productos.findIndex((p) => p.id === id);
  if (index === -1) {
    return res
      .status(404)
      .json({ message: `Producto con ID ${id} no encontrado` });
  }
  productos.splice(index, 1);
  res.json({ message: "Producto eliminado" });
});

export default router;
