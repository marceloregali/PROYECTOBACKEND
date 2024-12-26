import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid"; // Para generar un código único

const ticketSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
    default: () => uuidv4(), // Generar un código único automáticamente
  },
  purchase_datetime: {
    type: Date,
    default: Date.now, // Asignar fecha y hora actuales
  },
  amount: {
    type: Number,
    required: true, // Este campo es obligatorio
  },
  purchaser: {
    type: String,
    required: true, // Este campo es obligatorio
  },
});

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;
