import express from "express";
import helmet from "helmet";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import { fileURLToPath } from "url";
import { dirname } from "path";
import Handlebars from "express-handlebars";
import productsRouter from "./routes/products.js";
import cartsRouter from "./routes/carts.js";
import usersRouter from "./routes/users.js";
import viewsRouter from "./routes/views.js";
import Product from "./models/product.js"; // Modelo de producto
import { initializePassport } from "./config/passportConfig.js"; // Corregido a importación nombrada
import dotenv from "dotenv";

// Configuración de ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);

// Recupera las variables de entorno
const SECRET_KEY = process.env.JWT_SECRET_KEY; // La clave secreta para JWT
const MONGO_URI = process.env.MONGO_URI; // URI de conexión a MongoDB

// Conectar a MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.error("Error de conexión a MongoDB:", err));

// Configuración de Handlebars
app.engine("handlebars", Handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(helmet());
app.use(cookieParser()); // Habilitar cookie-parser para leer cookies
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secretKey", // Considera mover esto a .env
    resave: false,
    saveUninitialized: true,
  })
);

// Inicializar Passport y configurar la sesión
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// Ruta para obtener los datos del usuario logueado (protegida)
app.get(
  "/api/sessions/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "No autenticado" });
    }
    return res.json(req.user); // Devuelve los datos del usuario asociado al token JWT
  }
);

// Rutas
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", usersRouter);

// WebSockets
io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  const sendProductList = async () => {
    const products = await Product.find();
    io.emit("updateProducts", products);
  };

  sendProductList();

  socket.on("addProduct", async (product) => {
    const newProduct = new Product(product);
    await newProduct.save();
    sendProductList();
  });

  socket.on("disconnect", () => console.log("Cliente desconectado"));
});

// Middleware de manejo de errores global
app.use((err, req, res, next) => {
  console.error(err); // Log del error en el servidor
  const status = err.status || 500; // Si no se proporciona un código de estado, usamos 500 por defecto
  const message = err.message || "Error interno del servidor"; // Si no hay mensaje, usamos uno genérico
  res.status(status).json({ message });
});

// Iniciar el servidor
server.listen(8080, () =>
  console.log("Servidor escuchando en http://localhost:8080")
);
