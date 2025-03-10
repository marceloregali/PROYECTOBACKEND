import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Esquema de usuario
const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, "Por favor ingrese un correo electrónico válido"], // Validación de formato de correo
  },
  age: {
    type: Number,
    required: true,
    min: [18, "La edad debe ser al menos 18 años"], // Validación de edad
  },
  password: {
    type: String,
    required: true,
    minlength: [6, "La contraseña debe tener al menos 6 caracteres"], // Validación de longitud mínima de la contraseña
  },
  phoneNumber: {
    type: String,
    required: true,
    match: [/^\+?\d{10,15}$/, "Por favor ingrese un número de teléfono válido"], // Validación de formato de número telefónico
  },
});

// Encriptar la contraseña antes de guardar el usuario
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Método para comparar la contraseña al iniciar sesión
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Método para actualizar el perfil del usuario
userSchema.methods.updateProfile = async function (updateData) {
  // Este método actualizaría los datos del perfil del usuario
  Object.assign(this, updateData);
  await this.save();
};

// Método para restablecer la contraseña
userSchema.methods.resetPassword = async function (newPassword) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(newPassword, salt);
  await this.save();
};

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
