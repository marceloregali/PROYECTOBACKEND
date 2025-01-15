import UserRepository from "../repositories/user.repository.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "../services/emailService.js";

export const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userExists = await UserRepository.getUserByEmail(email);
    if (userExists)
      return res.status(400).json({ error: "El usuario ya existe" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserRepository.createUser({
      email,
      password: hashedPassword,
    });

    const verificationToken = jwt.sign(
      { id: newUser.id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    await sendVerificationEmail(newUser.email, verificationToken);

    res.status(201).json({
      message: "Usuario registrado, revisa tu correo para verificar tu cuenta.",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserRepository.getUserByEmail(email);
    if (!user) return res.status(400).json({ error: "Usuario no encontrado" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ error: "Contraseña incorrecta" });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
