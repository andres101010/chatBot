import ChatMemory from "../db/models/ChatMemory.js";

export const getOrCreateChat = async ({
  userId,
  whatsappAccountId,
  botConfigId,
  customerPhone,
  customerName
}) => {

  let chat = await ChatMemory.findOne({
    userId,
    whatsappAccountId,
    botConfigId,
    customerPhone
  });

  if (!chat) {

    chat = await ChatMemory.create({
      userId,
      whatsappAccountId,
      botConfigId,
      customerPhone,
      customerName,
      messages: []
    });

  }

  return chat;
};