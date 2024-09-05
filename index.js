import express from "express";
import helmet from "helmet"; // políticas de seguridad
import productsRouter from "./routes/products.js";
import cartsRouter from "./routes/carts.js";
import usersRouter from "./routes/users.js";

const app = express();

// Middleware para manejar JSON
app.use(express.json());

// Middleware de seguridad con helmet
app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "default-src": ["'self'"],
      "style-src": ["'self'", "https://fonts.googleapis.com"],
      "font-src": ["'self'", "https://fonts.gstatic.com"],
    },
  })
);

app.get("/", (req, res) => {
  res.send("Hola, soy un servidor");
});

app.get("/bienvenida", (req, res) => {
  res.send(
    `<h1 style="color:blue";> Bienvenido a mi primer servidor express</h1>`
  );
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
app.use("/api/users", usersRouter);

app.listen(8080, () => {
  console.log("Servidor levantado en puerto 8080");
});
