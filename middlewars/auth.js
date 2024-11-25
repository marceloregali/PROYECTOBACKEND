import jwt from "jsonwebtoken";

// Middleware para verificar token JWT
export const authenticateToken = (req, res, next) => {
  const token = req.cookies.token; // Asume que el token se almacena en una cookie llamada 'token'
  if (!token) {
    return res.status(401).json({ error: "No autorizado" });
  }

  jwt.verify(token, "mi-secreto", (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Token inválido" });
    }
    req.user = user; // Agrega la información del usuario al request
    next();
  });
};

// Middleware para verificar roles
export const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Acceso denegado" });
    }
    next();
  };
};
