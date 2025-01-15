import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

class SessionService {
  // Genero un JWT
  generateToken(user) {
    const payload = {
      userId: user._id,
      email: user.email,
      role: user.role,
    };
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
  }

  // Verifico un token JWT
  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (error) {
      throw new Error("Token inválido o expirado");
    }
  }
}

export default new SessionService();
