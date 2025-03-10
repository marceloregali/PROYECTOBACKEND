import { Router } from "express";
import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";
import UserModel from "../models/user.js";
import PetModel from "../models/pet.js";

const router = Router();

// Función para generar un usuario mock
const generateMockUser = () => {
  return {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: bcrypt.hashSync("coder123", 10), // Contraseña encriptada
    role: Math.random() > 0.5 ? "user" : "admin",
    pets: [],
  };
};

// Endpoint GET /mockingusers (Genera 50 usuarios mock)
router.get("/mockingusers", async (req, res) => {
  const mockUsers = Array.from({ length: 50 }, generateMockUser);
  res.json(mockUsers);
});

// Endpoint POST /generateData (Genera e inserta usuarios y mascotas en la DB)
router.post("/generateData", async (req, res) => {
  const { users = 0, pets = 0 } = req.body;

  try {
    // Generar usuarios
    const mockUsers = Array.from({ length: users }, generateMockUser);
    await UserModel.insertMany(mockUsers);

    // Generar mascotas
    const mockPets = Array.from({ length: pets }, () => ({
      name: faker.animal.dog(),
      age: faker.number.int({ min: 1, max: 15 }),
      type: "dog",
    }));
    await PetModel.insertMany(mockPets);

    res.json({ message: "Datos generados correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al generar datos" });
  }
});

export default router;
