import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import User from "../models/User.js";

const SECRET_KEY = process.env.JWT_SECRET_KEY || "your_secret_key"; // Usar clave secreta del .env

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    (req) => req.cookies.token, // Extraemos el token desde la cookie 'token'
  ]),
  secretOrKey: SECRET_KEY, // Clave secreta para verificar el JWT
};

passport.use(
  new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
    try {
      const user = await User.findById(jwtPayload.sub); // Buscamos al usuario por el ID en el JWT
      if (user) {
        return done(null, user); // Usuario encontrado
      } else {
        return done(null, false, { message: "Usuario no encontrado" }); // Usuario no encontrado
      }
    } catch (error) {
      return done(error, false); // En caso de error en la búsqueda del usuario
    }
  })
);

export const initializePassport = () => passport.initialize(); // Inicializar passport
