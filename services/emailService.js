import nodemailer from "nodemailer";
import { config } from "../config/config.js";

export const sendVerificationEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: config.EMAIL_USER,
      pass: config.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: config.EMAIL_USER,
    to: email,
    subject: "Verificación de cuenta",
    text: `Por favor, verifica tu cuenta haciendo clic en el siguiente enlace: ${config.BASE_URL}/verify-email?token=${token}`,
  };

  await transporter.sendMail(mailOptions);
};
