import express from "express";
import helmet from "helmet";
import productsRouter from "./routes/products.js";
import cartsRouter from "./routes/carts.js";
import usersRouter from "./routes/users.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import expressHandlebars from "express-handlebars";
import WebSocket from "ws"; // Importar ws

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Configuración de Handlebars
const hbs = expressHandlebars.create({
  layoutsDir: __dirname + "/layouts",
  defaultLayout: "main",
  extname: ".handlebars",
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", __dirname + "/layouts");

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

// Configuración del servidor WebSocket
const wss = new WebSocket.Server({ noServer: true });

wss.on("connection", (ws) => {
  console.log("Cliente conectado");

  ws.on("message", (message) => {
    console.log(`Mensaje recibido: ${message}`);
    ws.send(`Echo: ${message}`);
  });

  ws.on("close", () => {
    console.log("Cliente desconectado");
  });
});

// Adaptar el servidor para manejar WebSocket
app.server = app.listen(8080, () => {
  console.log("Servidor levantado en puerto 8080");
});

app.server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});
