import dotenv from "dotenv";

dotenv.config();

export const config = {
  JWT_SECRET: process.env.JWT_SECRET,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  BASE_URL: process.env.BASE_URL,
};
