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
import dotenv from "dotenv";

// Importar rutas
import productsRouter from "./routes/products.js";
import cartsRouter from "./routes/carts.js";
import usersRouter from "./routes/users.js";
import viewsRouter from "./routes/views.js";
import sessionsRouter from "./routes/sessions.js";

// Importar modelos y configuraciones
import Product from "./models/product.js";
import { initializePassport } from "./config/passportConfig.js";

// Configuración de ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno desde .env
dotenv.config();

// Configuración del servidor
const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);

// Variables de entorno
const SECRET_KEY = process.env.JWT_SECRET_KEY;
const MONGO_URI = process.env.MONGO_URI;

// Conexión a MongoDB
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
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secretKey", // Clave secreta para la sesión
    resave: false,
    saveUninitialized: true,
  })
);

// Inicialización de Passport
initializePassport(); // Configuración de Passport
app.use(passport.initialize());
app.use(passport.session()); // Habilita soporte de sesiones en Passport

// Rutas
app.use("/api/sessions", sessionsRouter);
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", usersRouter);

// Ruta protegida para obtener datos del usuario logueado
app.get(
  "/api/sessions/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "No autenticado" });
    }
    res.json({
      message: "Usuario autenticado",
      user: req.user, // Datos del usuario
    });
  }
);

// Configuración de WebSockets
io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  const sendProductList = async () => {
    const products = await Product.find();
    io.emit("updateProducts", products); // Emite la lista de productos
  };

  sendProductList();

  socket.on("addProduct", async (product) => {
    const newProduct = new Product(product);
    await newProduct.save();
    sendProductList();
  });

  socket.on("disconnect", () => console.log("Cliente desconectado"));
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err); // Log del error
  const status = err.status || 500;
  const message = err.message || "Error interno del servidor";
  res.status(status).json({ message });
});

// Inicio del servidor
server.listen(8080, () =>
  console.log("Servidor escuchando en http://localhost:8080")
);
