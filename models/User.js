import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  last_name: { type: String, required: true },
  age: { type: Number, required: true },
  correo: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Campo de contraseña
});

const User = mongoose.model("User", userSchema);

export default User;
