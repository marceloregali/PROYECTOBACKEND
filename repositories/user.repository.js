import UserDAO from "../Daos/user.dao.js";
import UserDTO from "../dtos/user.dto.js";
import bcrypt from "bcryptjs";

class UserRepository {
  // Obtengo un usuario por ID
  async getUserById(userId) {
    const user = await UserDAO.findById(userId);
    if (!user) throw new Error("Usuario no encontrado");
    return new UserDTO(user);
  }

  // Obtengo un usuario por correo electrónico
  async getUserByEmail(email) {
    const user = await UserDAO.findByEmail(email);
    if (!user) throw new Error("Usuario no encontrado");
    return new UserDTO(user);
  }

  // Creo un nuevo usuario
  async createUser(userData) {
    // Cifro la contraseña antes de crear el usuario
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await UserDAO.create({
      ...userData,
      password: hashedPassword,
    });
    return new UserDTO(user);
  }

  // Actualizo la información de un usuario
  async updateUser(userId, updateData) {
    const updatedUser = await UserDAO.update(userId, updateData);
    return new UserDTO(updatedUser);
  }

  // Obtengo todos los usuarios
  async getAllUsers() {
    const users = await UserDAO.findAll();
    return users.map((user) => new UserDTO(user));
  }

  // Verifico si las credenciales del usuario son correctas
  async validateUserCredentials(email, password) {
    const user = await UserDAO.findByEmail(email);
    if (!user) throw new Error("Usuario no encontrado");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error("Contraseña incorrecta");

    return new UserDTO(user);
  }

  // Verifico si un usuario está verificado
  async isUserVerified(userId) {
    const user = await UserDAO.findById(userId);
    if (!user) throw new Error("Usuario no encontrado");
    return user.isVerified; // Suponiendo que `isVerified` es un campo en el modelo de usuario
  }
}

export default new UserRepository();
