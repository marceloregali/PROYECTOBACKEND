import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js"; // Ahora importamos el modelo de usuario
import twilio from "twilio"; // Importamos Twilio

const router = Router();
const SECRET_KEY = process.env.JWT_SECRET_KEY || "default_secret_key";

// Configuración de Twilio
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const TWILIO_PHONE_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER; // Tu número de WhatsApp de Twilio

// Ruta para registrar un nuevo usuario
router.post("/register", async (req, res) => {
  const { first_name, last_name, email, age, password, phoneNumber } = req.body;

  if (
    !first_name ||
    !last_name ||
    !email ||
    !age ||
    !password ||
    !phoneNumber
  ) {
    return res.status(400).json({ message: "Todos los campos son requeridos" });
  }

  try {
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    // Crear el nuevo usuario
    const newUser = new User({
      first_name,
      last_name,
      email,
      age,
      password,
      phoneNumber,
    });

    // Guardar el usuario en la base de datos
    await newUser.save();

    // Enviar mensaje de bienvenida por WhatsApp
    const message = `¡Hola ${first_name}! Gracias por registrarte. Estamos felices de tenerte con nosotros.`;
    await client.messages.create({
      body: message,
      from: `whatsapp:${TWILIO_PHONE_NUMBER}`,
      to: `whatsapp:${phoneNumber}`,
    });

    res.status(201).json({ message: "Usuario registrado", user: newUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al registrar el usuario", error: error.message });
  }
});

// Ruta para login y generación de token JWT
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar al usuario por email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Verificar la contraseña
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    // Generar el token JWT
    const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.json({ message: "Login exitoso", token });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error durante el login", error: error.message });
  }
});

// Ruta para obtener información del usuario actual
router.get("/current", async (req, res) => {
  try {
    const userId = req.user._id; // Asumiendo que req.user es configurado por un middleware de autenticación
    const user = await User.findById(userId);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
