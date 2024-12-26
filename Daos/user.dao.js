import User from "../models/user.js";

class UserDAO {
  async create(userData) {
    return await User.create(userData);
  }

  async findById(userId) {
    return await User.findById(userId);
  }

  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async update(userId, updateData) {
    return await User.findByIdAndUpdate(userId, updateData, { new: true });
  }

  async delete(userId) {
    return await User.findByIdAndDelete(userId);
  }

  async findAll() {
    return await User.find();
  }
}

export default new UserDAO();
