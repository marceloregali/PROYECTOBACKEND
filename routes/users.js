import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = Router();
const SECRET_KEY = process.env.SECRET_KEY || "default_secret_key";

// Ruta para registrar un nuevo usuario
router.post("/register", async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;

  // Verifica si ya existe el correo
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "El correo ya está registrado" });
  }

  // Encriptar la contraseña
  const hashedPassword = bcrypt.hashSync(password, 10);

  // Crear un nuevo usuario
  const newUser = new User({
    first_name,
    last_name,
    email,
    age,
    password: hashedPassword,
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json({ message: "Usuario registrado", user: savedUser });
  } catch (error) {
    res.status(500).json({ message: "Error al registrar el usuario" });
  }
});

// Ruta para login y generación de token JWT
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Verifica la contraseña
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    // Genera el token JWT
    const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, {
      expiresIn: "1h", // Expiración del token (1 hora)
    });

    res.json({ message: "Login exitoso", token });
  } catch (error) {
    res.status(500).json({ message: "Error durante el login" });
  }
});

export default router;
