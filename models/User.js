import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// usuario
const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, "Correo inválido"],
  },
  age: { type: Number, required: true, min: [18, "Debe ser mayor de 18"] },
  password: { type: String, required: true, minlength: 6 },
  phoneNumber: {
    type: String,
    required: true,
    match: [/^\+?\d{10,15}$/, "Número de teléfono inválido"],
  },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  pets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pet" }],
});

// Encriptar la contraseña antes de guardar
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//  comparar contraseña
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Actualizar el perfil del usuario
userSchema.methods.updateProfile = async function (updateData) {
  // Este método actualizaría los datos del perfil del usuario
  Object.assign(this, updateData);
  await this.save();
};

//  restablecer la contraseña
userSchema.methods.resetPassword = async function (newPassword) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(newPassword, salt);
  await this.save();
};

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
