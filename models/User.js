import express from "express";
import passport from "passport"; // Asegúrate de importar passport
import User from "../models/User.js"; // Importa el modelo de usuario

const router = express.Router();

// Ruta para iniciar sesión
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Buscar al usuario por correo electrónico
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    // Verificar la contraseña
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Si las credenciales son correctas, iniciar sesión
    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ message: "Error al iniciar sesión" });
      }
      res.status(200).json({ message: "Inicio de sesión exitoso", user });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al autenticar al usuario" });
  }
});

export default router;
