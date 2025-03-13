import { Router } from "express";
import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";
import UserModel from "../models/User.js";
import PetModel from "../models/pet.js";
import mongoose from "mongoose";

const router = Router();

//  generar usuarios mock con ID de MongoDB
const generateMockUser = () => {
  return {
    _id: new mongoose.Types.ObjectId(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: bcrypt.hashSync("coder123", 10),
    role: Math.random() > 0.5 ? "user" : "admin",
    pets: [],
  };
};

//  generar mascotas mock
const petTypes = ["dog", "cat", "rabbit", "parrot", "hamster"];
const generateMockPet = () => ({
  name: faker.animal.dog(),
  age: faker.number.int({ min: 1, max: 15 }),
  type: faker.helpers.arrayElement(petTypes),
});

// Endpoint GET para obtener usuarios mock (50 por defecto)
router.get("/mockingusers", async (req, res) => {
  const mockUsers = Array.from({ length: 50 }, generateMockUser);
  res.json({ users: mockUsers, count: mockUsers.length });
});

// Endpoint POST para generar usuarios y mascotas en la base de datos
router.post("/generateData", async (req, res) => {
  const { users = 0, pets = 0 } = req.body;

  try {
    const mockUsers = Array.from({ length: users }, generateMockUser);
    const createdUsers = await UserModel.insertMany(mockUsers);

    const mockPets = Array.from({ length: pets }, generateMockPet);
    const createdPets = await PetModel.insertMany(mockPets);

    res.json({
      message: "Datos generados correctamente",
      users: createdUsers,
      pets: createdPets,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al generar datos", details: error.message });
  }
});

export default router;
