import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("hola soy un servidor");
});

app.get("/bienvenida", (req, res) => {
  res.send(`<h1 style="color:blue";> Bienvenido a mi primer servidor express`);
});
app.get("/usuario", (req, res) => {
  const usuario = {
    nombre: "pedro",
    edad: 30,
    apellido: "perez",
  };
  res.send(usuario);
});

const usuarios = [
  { id: 1, nombre: "Diego", apellido: "Perez", edad: 40 },
  { id: 2, nombre: "Dardo", apellido: "Milanesio", edad: 23 },
  { id: 3, nombre: "Carolina", apellido: "Tomatis", edad: 35 },
];

app.get("/usuarios", (req, res) => {
  res.send(usuarios);
});

app.get("/usuarios/:userID", (req, res) => {
  const idUsuario = +req.params.userId;
  const usuario = usuarios.find((usuario) => usuario.id === idUsuario);
  if (!usuario) {
    res.send(`no existe el usuario con el id ${idUsuario}`);
    return;
  }
  res.send(usuario);
});

app.listen(8080, () => {
  console.log("servidor levantado en puerto 8080");
});
