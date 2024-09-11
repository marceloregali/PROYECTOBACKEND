import express from "express";
import helmet from "helmet";
import productsRouter from "./routes/products.js";
import cartsRouter from "./routes/carts.js";
import usersRouter from "./routes/users.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import Handlebars from "express-handlebars";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import viewsRoute from "./routes/views.js"; // Asegúrate de que esta ruta sea correcta

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);

app.engine("handlebars", Handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

// Middleware para manejar JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", viewsRoute);

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

// Configuración de Socket.IO
io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  socket.on("message", (data) => {
    console.log(data);
  });

  socket.on("message2", (data) => {
    console.log("Hola nuevamente" + data);
  });
});

/*SocketServer.on("connection", (socket) => {
  console.log("nuevo cliente");

  socket.on("messaje", (data) => {
    console.log(data);
  });

  socket.emit("evento");

  socket.broadcast.emit("evento para todos");
});*/

// Iniciar el servidor(bien )
const httpServer = app.listen(8080, () => {
  console.log("Server ON");
});
