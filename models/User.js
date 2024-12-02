import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: { type: String, unique: true },
  age: Number,
  password: String, // Contraseña encriptada
  cart: { type: mongoose.Schema.Types.ObjectId, ref: "Cart" },
  role: { type: String, default: "user" },
});

// Método para comparar la contraseña durante el login
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password); // Compara la contraseña ingresada con la encriptada
};

const User = mongoose.model("User", userSchema);

export default User;
