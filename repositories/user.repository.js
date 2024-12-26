import UserDAO from "../Daos/user.dao.js";
import UserDTO from "../dtos/user.dto.js";

class UserRepository {
  async getUserById(userId) {
    const user = await UserDAO.findById(userId);
    if (!user) throw new Error("Usuario no encontrado");
    return new UserDTO(user);
  }

  async getUserByEmail(email) {
    const user = await UserDAO.findByEmail(email);
    if (!user) throw new Error("Usuario no encontrado");
    return new UserDTO(user);
  }

  async createUser(userData) {
    const user = await UserDAO.create(userData);
    return new UserDTO(user);
  }

  async updateUser(userId, updateData) {
    const updatedUser = await UserDAO.update(userId, updateData);
    return new UserDTO(updatedUser);
  }

  async getAllUsers() {
    const users = await UserDAO.findAll();
    return users.map((user) => new UserDTO(user));
  }
}

export default new UserRepository();
