import sessionService from "../services/session.service.js";

// Middleware de autenticación
export const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = sessionService.verifyToken(token);
    req.user = decoded; // Almaceno los datos decodificados del usuario
    next();
  } catch (err) {
    return res.status(403).json({ error: "Token is not valid" });
  }
};

// Middleware de autorización por rol
export const authorizeRole = (requiredRole) => {
  return (req, res, next) => {
    if (req.user.role !== requiredRole) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }
    next();
  };
};
