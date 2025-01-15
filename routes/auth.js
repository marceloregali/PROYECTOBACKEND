import User from "./models/user.js";
import jwt from "jsonwebtoken";
import { register, login } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// Registro de usuario
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });
    await user.save();
    res.status(201).json({ message: "Usuario registrado exitosamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al registrar usuario" });
  }
});

// Inicio de sesión
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, "mi-secreto", {
      expiresIn: "1h",
    });
    res
      .cookie("token", token, { httpOnly: true })
      .json({ message: "Inicio de sesión exitoso" });
  } catch (error) {
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
});

// Cierre de sesión
router.post("/logout", (req, res) => {
  res.clearCookie("token").json({ message: "Cierre de sesión exitoso" });
});

export default router;
