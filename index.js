import express from "express";
import productsRouter from "./routes/products.js";
import cartsRouter from "./routes/carts.js";
import usersRouter from "./routes/users.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hola, soy un servidor");
});

app.get("/bienvenida", (req, res) => {
  res.send(`<h1 style="color:blue";> Bienvenido a mi primer servidor express`);
});

app.get("/usuario", (req, res) => {
  const usuario = {
    nombre: "Pedro",
    edad: 30,
    apellido: "Perez",
  };
  res.send(usuario);
});

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/users", usersRouter);

app.listen(8080, () => {
  console.log("Servidor levantado en puerto 8080");
});
