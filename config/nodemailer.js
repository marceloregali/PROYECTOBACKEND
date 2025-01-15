import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "tu_correo@gmail.com", //Correo de Gmail
    pass: "tu_contraseña", // Contraseña
  },
});

export default transporter;
