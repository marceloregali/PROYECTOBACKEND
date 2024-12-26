import twilio from "twilio";

// Configuración de Twilio
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

// Función para enviar WhatsApp
export const sendWhatsAppMessage = async (to, message) => {
  try {
    const messageSent = await client.messages.create({
      body: message,
      from: process.env.TWILIO_WHATSAPP_NUMBER, // Número de WhatsApp de Twilio
      to: `whatsapp:${to}`, // Número destino en formato internacional
    });
    console.log("Mensaje de WhatsApp enviado:", messageSent.sid);
  } catch (error) {
    console.error("Error al enviar mensaje de WhatsApp:", error);
  }
};
