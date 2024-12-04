import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import User from "../models/User.js";

// Clave secreta para JWT
const SECRET_KEY = process.env.JWT_SECRET_KEY || "your_secret_key";

// Opciones de configuración para JWT
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    (req) => req?.cookies?.token || null, // Extrae el token desde la cookie "token"
  ]),
  secretOrKey: SECRET_KEY, // Clave secreta para verificar el JWT
};

// Configuración de la estrategia JWT
passport.use(
  new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
    try {
      const user = await User.findById(jwtPayload.sub); // Busca al usuario por el ID en el payload
      if (user) {
        return done(null, user); // Usuario encontrado
      } else {
        return done(null, false, { message: "Usuario no encontrado" }); // Usuario no encontrado
      }
    } catch (error) {
      return done(error, false); // En caso de error
    }
  })
);

// Inicialización de Passport
export const initializePassport = () => passport.initialize();
