import express from "express";
import User from "../models/User.js"; // Asegúrate de que esta ruta sea correcta
const router = express.Router();

// Obtengo todos los usuarios
router.get("/", async (req, res) => {
  try {
    const usuarios = await User.find(); // Obtener todos los usuarios de la base de datos
    res.json(usuarios);
  } catch (err) {
    console.error(err); // Mostrar el error en la consola
    res.status(500).json({ message: "Error al leer los usuarios" });
  }
});

// Obtengo un usuario por ID
router.get("/:userId", async (req, res) => {
  try {
    const idUsuario = req.params.userId;
    const usuario = await User.findById(idUsuario); // Buscar el usuario por ID en la base de datos
    if (!usuario) {
      return res
        .status(404)
        .json({ message: `Usuario con ID ${idUsuario} no encontrado` });
    }
    res.json(usuario);
  } catch (err) {
    console.error(err); // Mostrar el error en la consola
    res.status(500).json({ message: "Error al leer los usuarios" });
  }
});

export default router;
