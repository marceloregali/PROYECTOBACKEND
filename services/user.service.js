import userRepository from "../repositories/users.repository.js";

class UserService {
  async getUserById(userId) {
    try {
      return await userRepository.getUserById(userId);
    } catch (error) {
      throw new Error(`Error al obtener el usuario por ID: ${error.message}`);
    }
  }

  async getUserByEmail(email) {
    try {
      return await userRepository.getUserByEmail(email);
    } catch (error) {
      throw new Error(
        `Error al obtener el usuario por email: ${error.message}`
      );
    }
  }

  async createUser(userData) {
    try {
      return await userRepository.createUser(userData);
    } catch (error) {
      throw new Error(`Error al crear el usuario: ${error.message}`);
    }
  }

  async updateUser(userId, updateData) {
    try {
      return await userRepository.updateUser(userId, updateData);
    } catch (error) {
      throw new Error(`Error al actualizar el usuario: ${error.message}`);
    }
  }

  async getAllUsers() {
    try {
      return await userRepository.getAllUsers();
    } catch (error) {
      throw new Error(`Error al obtener todos los usuarios: ${error.message}`);
    }
  }
}

export default new UserService();
