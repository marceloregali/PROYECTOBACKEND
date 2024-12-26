import jwt from "jsonwebtoken";

// Middleware para verificar token JWT
export const authenticateToken = (req, res, next) => {
  const token = req.cookies.token; // Suponiendo que el token está en una cookie llamada 'token'
  if (!token) {
    return res.status(401).json({ error: "No autorizado" });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Token inválido" });
    }
    req.user = user; // Agregar la información del usuario al request
    next();
  });
};

// Middleware para verificar roles
export const authorizeRole = (requiredRole) => {
  return (req, res, next) => {
    const userRole = req.user.role; // Suponiendo que el rol viene en el token
    if (userRole !== requiredRole) {
      return res.status(403).json({ error: "Acceso denegado" });
    }
    next();
  };
};
