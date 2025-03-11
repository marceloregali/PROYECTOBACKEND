import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";
import User from "./models/User.js"; // Asegúrate de que la ruta sea correcta

// Función para generar usuarios falsos
export const generateMockUsers = async (numUsers = 10) => {
  const users = [];

  for (let i = 0; i < numUsers; i++) {
    const password = "123456"; // Contraseña genérica para pruebas
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    users.push({
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email().toLowerCase(),
      age: faker.number.int({ min: 18, max: 60 }),
      password: hashedPassword,
      phoneNumber: faker.phone.number("+###########"),
      role: faker.helpers.arrayElement(["admin", "user"]),
      pets: [],
    });
  }

  return users;
};
