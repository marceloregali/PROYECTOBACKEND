import express from "express";
import User from "../models/User.js"; // Asegúrate de que esta ruta sea correcta
const router = express.Router();

// Veo todos los usuarios
router.get("/", async (req, res) => {
  try {
    const usuarios = await User.find(); // Obtener todos los usuarios de la base de datos
    res.json(usuarios);
  } catch (err) {
    console.error(err); // Veo el error en la consola
    res.status(500).json({ message: "Error al leer los usuarios" });
  }
});

// Veo un usuario por ID
router.get("/:userId", async (req, res) => {
  try {
    const idUsuario = req.params.userId;
    const usuario = await User.findById(idUsuario); // Buscar un usuario por ID registrado
    if (!usuario) {
      return res
        .status(404)
        .json({ message: `Usuario con ID ${idUsuario} no encontrado` });
    }
    res.json(usuario);
  } catch (err) {
    console.error(err); // Veo el error en la consola
    res.status(500).json({ message: "Error al leer el usuario" });
  }
});

// Creo un nuevo usuario
router.post("/", async (req, res) => {
  const { name, last_name, age, correo, password } = req.body;
  const nuevoUsuario = new User({ name, last_name, age, correo, password });

  try {
    const usuarioGuardado = await nuevoUsuario.save(); // Guardardo nuevo usuario
    res.status(201).json(usuarioGuardado);
  } catch (err) {
    console.error(err); // Veo el error en la consola
    res.status(400).json({ message: "Error al crear el usuario" });
  }
});

// Modifico un usuario por ID
router.put("/:userId", async (req, res) => {
  const { userId } = req.params;
  const { name, last_name, age, correo, password } = req.body;

  try {
    const usuarioActualizado = await User.findByIdAndUpdate(
      userId,
      { name, last_name, age, correo, password },
      { new: true } // Devuelve el usuario actualizado
    );
    if (!usuarioActualizado) {
      return res
        .status(404)
        .json({ message: `Usuario con ID ${userId} no encontrado` });
    }
    res.json(usuarioActualizado);
  } catch (err) {
    console.error(err); // Veo el error en la consola
    res.status(400).json({ message: "Error al actualizar el usuario" });
  }
});

// Borro un usuario por ID
router.delete("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const usuarioEliminado = await User.findByIdAndDelete(userId); // Eliminar usuario por ID
    if (!usuarioEliminado) {
      return res
        .status(404)
        .json({ message: `Usuario con ID ${userId} no encontrado` });
    }
    res.json({ message: `Usuario con ID ${userId} eliminado` });
  } catch (err) {
    console.error(err); // Veo el error en la consola
    res.status(400).json({ message: "Error al eliminar el usuario" });
  }
});

export default router;
