import BotConfig from "../db/model/BotConfig.js";
import WhatsAppAccount from "../db/model/WhatsAppAccount.js";

export const createBot = async (req, res) => {
  try {

    const userId = req.user.id;

    const {
      whatsappAccountId,
      name,
      systemPrompt,
      greeting
    } = req.body;

    const whatsappAccount = await WhatsAppAccount.findOne({
      _id: whatsappAccountId,
      userId
    });

    if (!whatsappAccount) {
      return res.status(404).json({
        message: "WhatsApp no encontrado"
      });
    }

    const bot = await BotConfig.create({
      userId,
      whatsappAccountId,
      name,
      systemPrompt,
      greeting,
      active: true
    });

    return res.status(201).json({
      message: "Bot creado correctamente",
      bot
    });

  } catch (error) {

    console.error("Error creando bot:", error);

    return res.status(500).json({
      message: "Error interno del servidor"
    });
  }
};

export const updateBotPrompt = async (req, res) => {
  try {

    const userId = req.user.id;

    const {
      botId
    } = req.params;

    const {
      systemPrompt
    } = req.body;

    const bot = await BotConfig.findOneAndUpdate(
      {
        _id: botId,
        userId
      },
      {
        systemPrompt
      },
      {
        new: true
      }
    );

    if (!bot) {
      return res.status(404).json({
        message: "Bot no encontrado"
      });
    }

    return res.json({
      message: "Prompt actualizado correctamente",
      bot
    });

  } catch (error) {

    console.error(
      "Error actualizando prompt:",
      error
    );

    return res.status(500).json({
      message: "Error interno del servidor"
    });
  }
};