import express from "express";
import fs from "fs/promises";
const router = express.Router();
const filePath = "./database/usuarios.json";

// leer los usuarios
const getUsuarios = async () => {
  const data = await fs.readFile(filePath, "utf8");
  return JSON.parse(data);
};

// Obtener usuarios
router.get("/", async (req, res) => {
  try {
    const usuarios = await getUsuarios();
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ message: "Error al leer los usuarios" });
  }
});

//  usuario por ID
router.get("/:userId", async (req, res) => {
  try {
    const usuarios = await getUsuarios();
    const idUsuario = +req.params.userId;
    const usuario = usuarios.find((usuario) => usuario.id === idUsuario);
    if (!usuario) {
      return res
        .status(404)
        .json({ message: `Usuario con ID ${idUsuario} no encontrado` });
    }
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ message: "Error al leer los usuarios" });
  }
});

export default router;
