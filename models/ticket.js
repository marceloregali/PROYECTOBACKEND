import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

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
    required: true,
  },
  purchaser: {
    type: String,
    required: true,
  },
});

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;
