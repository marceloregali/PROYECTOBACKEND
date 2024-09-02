import express from "express";
const router = express.Router();

const usuarios = [
  { id: 1, nombre: "Diego", apellido: "Perez", edad: 40 },
  { id: 2, nombre: "Dardo", apellido: "Milanesio", edad: 23 },
  { id: 3, nombre: "Carolina", apellido: "Tomatis", edad: 35 },
];

// todos los usuarios
router.get("/", (req, res) => {
  res.json(usuarios);
});

//  obtener un usuario por ID
router.get("/:userId", (req, res) => {
  const idUsuario = +req.params.userId;
  const usuario = usuarios.find((usuario) => usuario.id === idUsuario);
  if (!usuario) {
    return res
      .status(404)
      .json({ message: `Usuario con ID ${idUsuario} no encontrado` });
  }
  res.json(usuario);
});

export default router;
