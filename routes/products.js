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

app.get("/productos", (req, res) => {
  res.send(productos);
});
