import express from "express";
import helmet from "helmet";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import productsRouter from "./routes/products.js";
import cartsRouter from "./routes/carts.js";
import usersRouter from "./routes/users.js";
import viewsRoute from "./routes/views.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import Handlebars from "express-handlebars";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import bcrypt from "bcrypt";
import User from "./models/User.js";
import initializePassport from "./config/passportConfig.js"; // Importa la configuración de Passport
import fetch from "node-fetch"; // Asegúrate de instalar esta librería si usas Node <18

// Configuración para trabajar con rutas en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);

// Conectar a MongoDB
mongoose
  .connect(
    "mongodb+srv://marceloivanregali:8924578mro@cluster0.khst2.mongodb.net/project0"
  )
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.error("Error de conexión a MongoDB:", err));

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
      "style-src": [
        "'self'",
        "https://fonts.googleapis.com",
        "'unsafe-inline'",
      ],
      "font-src": ["'self'", "https://fonts.gstatic.com"],
      "script-src": ["'self'", "'unsafe-inline'"],
    },
  })
);
app.use(cookieParser());
app.use(
  session({
    secret: "secretKey", // Clave secreta para firmar la sesión
    resave: false,
    saveUninitialized: true,
  })
);

// Inicialización de Passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// Rutas de Autenticación
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
    failureFlash: false,
  })
);

app.post("/signup", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ email, password: hashedPassword });
    res.redirect("/login");
  } catch (error) {
    next(error);
  }
});

app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/login");
  });
});

// Rutas de Cookies
app.get("/set-cookie", (req, res) => {
  res.cookie("usuario", "Marcelo", { maxAge: 3600000, httpOnly: true });
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

  socket.on("productUpdated", sendProductList);
  socket.on("disconnect", () => console.log("Cliente desconectado"));
});

// Middleware de error
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Algo salió mal");
});

// Iniciar Servidor
server.listen(8080, () => console.log("Server ON"));
