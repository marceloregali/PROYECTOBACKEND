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
import twilio from "twilio";

// Importacion de rutas
import productsRouter from "./routes/products.js";
import cartsRouter from "./routes/carts.js";
import usersRouter from "./routes/users.js";
import viewsRouter from "./routes/views.js";
import sessionsRouter from "./routes/sessions.js";

// Importar modelos, configuraciones y middlewares
import Product from "./models/product.js";
import { initializePassport } from "./config/passportConfig.js";
import { authenticateToken } from "./middlewars/auth.js";

// Configuración de ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno
dotenv.config();

// Variables de entorno
const SECRET_KEY = process.env.JWT_SECRET_KEY || "default_secret_key";
const MONGO_URI = process.env.MONGO_URI; //  Archivo .env
const TWILIO_PHONE_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER; // Número de WhatsApp de Twilio

// Configuración de Twilio
const client = twilio(process.env.TWILIO_ACCOUNT_ID, process.env.TWILIO_TOKEN);

// Configuración del servidor
const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);

// Conexión a MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Conectado a MongoDB");
  })
  .catch((err) => {
    console.error("Error de conexión a MongoDB:", err.message);
    process.exit(1); // si no se puede conectar a MongoDB se detiene el servidor.
  });

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
    secret: process.env.SESSION_SECRET || "secretKey",
    resave: false,
    saveUninitialized: true,
  })
);

// Inicialización de Passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// Rutas
app.use("/api/sessions", sessionsRouter);
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", usersRouter);

// Ruta para enviar mensaje de WhatsApp de manera asincrónica
app.post("/send-whatsapp", (req, res) => {
  const { phoneNumber, message } = req.body;

  // Respuesta inmediata
  res.json({ message: "Mensaje en proceso", status: "sending" });

  // Enviar mensaje de WhatsApp de manera asincrónica
  (async () => {
    try {
      const messageSent = await client.messages.create({
        body: message,
        from: `whatsapp:${TWILIO_PHONE_NUMBER}`, // Tu número de WhatsApp de Twilio
        to: `whatsapp:${phoneNumber}`, // Número de destino
      });

      console.log("Mensaje enviado a:", phoneNumber);
    } catch (error) {
      console.error("Error al enviar mensaje de WhatsApp:", error);
    }
  })();
});

// Ruta protegida con middleware de autenticación para obtener datos del usuario actual
app.get("/api/sessions/current", authenticateToken, (req, res) => {
  res.json({
    message: "Usuario autenticado",
    user: req.user, // Datos del usuario autenticado proporcionados por el token
  });
});

// Configuración de WebSockets
io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  const sendProductList = async () => {
    try {
      const products = await Product.find();
      io.emit("updateProducts", products);
    } catch (error) {
      console.error("Error al obtener la lista de productos:", error);
    }
  };

  sendProductList();

  socket.on("addProduct", async (product) => {
    try {
      const newProduct = new Product(product);
      await newProduct.save();
      sendProductList();
    } catch (error) {
      console.error("Error al agregar un producto:", error);
    }
  });

  socket.on("disconnect", () => console.log("Cliente desconectado"));
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err); // Logging del error
  const status = err.status || 500;
  const message = err.message || "Error interno del servidor";
  res.status(status).json({ message });
});

// Inicio del servidor
const PORT = process.env.PORT || 8080;
server.listen(PORT, () =>
  console.log(`Servidor escuchando en http://localhost:${PORT}`)
);
