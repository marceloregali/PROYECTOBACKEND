import { Ticket } from "../models/ticket.js";

export default class TicketRepository {
  static async create(ticketData) {
    return await Ticket.create(ticketData);
  }
}
