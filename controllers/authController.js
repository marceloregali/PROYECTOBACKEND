import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const SECRET_KEY = process.env.JWT_SECRET || "default_secret_key";

// Controlador para registrar un nuevo usuario
export const register = async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;

  try {
    // Verificar si el correo ya está registrado
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    // Cifrar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear un nuevo usuario
    const newUser = new User({
      first_name,
      last_name,
      email,
      age,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    res.status(201).json({ message: "Usuario registrado", user: savedUser });
  } catch (error) {
    res.status(500).json({ message: "Error al registrar el usuario", error });
  }
};

// Controlador para login de usuarios
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar al usuario por su email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Verificar la contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    // Generar un token JWT
    const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.json({ message: "Login exitoso", token });
  } catch (error) {
    res.status(500).json({ message: "Error durante el login", error });
  }
};
