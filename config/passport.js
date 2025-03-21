import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import User from "../models/User.js";

const SECRET_KEY = process.env.JWT_SECRET_KEY || "your_secret_key"; // Archivo .env

// Configuración de la estrategia JWT
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    (req) => req.cookies.token, // Extraigo el token de la cookie llamada 'token'
  ]),
  secretOrKey: SECRET_KEY, // Clave secreta para validar el JWT
};

// Configuro estrategia JWT
passport.use(
  new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
    try {
      // Buscar el usuario usando el 'sub' (que es el ID del usuario en el JWT)
      const user = await User.findById(jwtPayload.sub);

      if (user) {
        // Si el usuario existe, lo devuelve
        return done(null, user);
      } else {
        // Si no se encuentra el usuario, devuelve un error
        return done(null, false, { message: "Usuario no encontrado" });
      }
    } catch (error) {
      // En caso de error, lo pasamos al callback
      return done(error, false);
    }
  })
);

// Serialización y deserialización del usuario
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;
