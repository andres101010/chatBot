import WhatsAppAccount from "../db/model/WhatsAppAccount.js";
import Subscription from "../db/model/Subscription.js";

export const createWhatsAppAccount = async (req, res) => {
  try {

    const {
      phoneNumber,
      phoneNumberId,
      businessAccountId,
      accessToken
    } = req.body;

    const userId = req.user.id;

    if (
      !phoneNumber ||
      !phoneNumberId ||
      !businessAccountId ||
      !accessToken
    ) {
      return res.status(400).json({
        message: "Faltan datos de WhatsApp"
      });
    }

    const subscription = await Subscription.findOne({
      userId,
      status: "active"
    });

    if (!subscription) {
      return res.status(403).json({
        message: "El usuario no tiene una suscripción activa"
      });
    }

    const existingWhatsApp = await WhatsAppAccount.findOne({
      phoneNumberId
    });

    if (existingWhatsApp) {
      return res.status(409).json({
        message: "Este número de WhatsApp ya está registrado"
      });
    }

    const whatsappAccount = await WhatsAppAccount.create({
      userId,
      phoneNumber,
      phoneNumberId,
      businessAccountId,
      accessToken,
      status: "active"
    });

    return res.status(201).json({
      message: "WhatsApp registrado correctamente",
      whatsappAccount: {
        id: whatsappAccount._id,
        phoneNumber: whatsappAccount.phoneNumber,
        phoneNumberId: whatsappAccount.phoneNumberId,
        status: whatsappAccount.status
      }
    });

  } catch (error) {

    console.error(
      "Error registrando WhatsApp:",
      error
    );

    return res.status(500).json({
      message: "Error interno del servidor"
    });
  }
};

export const receiveWhatsAppMessage = async (
  req,
  res
) => {

  try {

    const {
      phoneNumberId,
      customerPhone,
      customerName,
      body
    } = req.body;

    if (
      !phoneNumberId ||
      !customerPhone ||
      !body
    ) {
      return res.status(400).json({
        message: "Datos incompletos"
      });
    }

    const result = await runChat({
      phoneNumberId,
      customerPhone,
      customerName,
      body
    });

    /*
     * Aquí posteriormente:
     *
     * await sendWhatsAppMessage(...)
     */

    return res.json({
      success: true,
      reply: result.reply
    });

  } catch (error) {

    console.error(
      "Webhook WhatsApp:",
      error
    );

    return res.status(500).json({
      success: false
    });
  }
};