import express from "express";
import helmet from "helmet";
import mongoose from "mongoose";
import cookieParser from "cookie-parser"; // Importar cookie-parser
import productsRouter from "./routes/products.js";
import cartsRouter from "./routes/carts.js";
import usersRouter from "./routes/users.js";
import viewsRoute from "./routes/views.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import Handlebars from "express-handlebars";
import http from "http";
import { Server as SocketIOServer } from "socket.io";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Conectar a MongoDB
mongoose
  .connect(
    "mongodb+srv://marceloivanregali:8924578mro@cluster0.khst2.mongodb.net/project0"
  )
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.error("Error de conexión a MongoDB:", err));

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);

// Configuración de Handlebars
app.engine("handlebars", Handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
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
app.use(cookieParser()); // Activar cookie-parser

// Rutas para manejo de cookies
app.get("/set-cookie", (req, res) => {
  res.cookie("usuario", "Marcelo", {
    maxAge: 1000 * 60 * 60,
    httpOnly: true,
  });
  res.send("Cookie 'usuario' establecida");
});

app.get("/get-cookies", (req, res) => {
  res.send(`Tus cookies: ${JSON.stringify(req.cookies)}`);
});

app.get("/delete-cookie", (req, res) => {
  res.clearCookie("usuario");
  res.send("Cookie 'usuario' eliminada");
});

// Rutas principales
app.use("/", viewsRoute);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", usersRouter);

// Socket.IO
io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  const sendProductList = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/products");
      if (!response.ok) throw new Error("Error en la respuesta de la API");
      const products = await response.json();
      io.emit("updateProducts", products);
    } catch (error) {
      console.error("Error al obtener la lista de productos:", error);
    }
  };

  sendProductList();

  socket.on("productUpdated", async () => {
    sendProductList();
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});

// Middleware de error
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Algo salió mal");
});

// Iniciar Servidor
const httpServer = server.listen(8080, () => {
  console.log("Server ON");
});
