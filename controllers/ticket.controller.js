import Ticket from "../models/ticket.js";
import CartRepository from "../repositories/cart.repository.js";
import transporter from "../config/nodemailer.js";

export const createTicket = async (req, res) => {
  try {
    const { cartId } = req.body; //  Obtiengo el cartId de la solicitud
    const cart = await CartRepository.getCartById(cartId); // Obtener el carrito desde el repositorio

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    // Cálculo el total, asumiendo que cada producto tiene un precio
    const amount = cart.productos.reduce(
      (total, item) => total + item.quantity * item.product.price,
      0
    );

    // Crear un nuevo ticket
    const ticket = await Ticket.create({
      amount,
      purchaser: req.user.first_name + " " + req.user.last_name,
      cart: cartId,
    });

    // Enviar un correo de confirmación
    const mailOptions = {
      from: "tu_correo@gmail.com",
      to: req.user.email, // El correo del usuario
      subject: "Confirmación de Compra - Ticket #" + ticket.code,
      text: `Gracias por tu compra! \n\nCódigo de Ticket: ${ticket.code}\nCantidad total: $${ticket.amount}\n\nTu compra está siendo procesada.`,
    };

    // Enviar el correo
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Error al enviar correo", err);
        return res
          .status(500)
          .json({ error: "Error al enviar correo de confirmación" });
      }
      console.log("Correo enviado: " + info.response);
    });

    // Devolver el ticket como respuesta
    res.status(201).json(ticket);
  } catch (error) {
    console.error("Error al crear el ticket:", error);
    res.status(500).json({ error: "Error al crear el ticket" });
  }
};
