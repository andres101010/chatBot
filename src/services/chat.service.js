// chat.service.js

import OpenAI from "openai";
import WhatsAppAccount from "../models/WhatsAppAccount.js";
import BotConfig from "../models/BotConfig.js";
import ChatMemory from "../models/ChatMemory.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const getOrCreateChat = async ({
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

export const runChat = async ({
  phoneNumberId,
  customerPhone,
  customerName,
  body
}) => {

  const whatsappAccount =
    await WhatsAppAccount
      .findOne({
        phoneNumberId,
        status: "active"
      })
      .select("+accessToken");

  if (!whatsappAccount) {
    throw new Error(
      "WhatsApp no encontrado"
    );
  }

  const bot = await BotConfig.findOne({
    userId: whatsappAccount.userId,
    whatsappAccountId: whatsappAccount._id,
    active: true
  });

  if (!bot) {
    throw new Error(
      "No existe un bot activo"
    );
  }

  const chat = await getOrCreateChat({
    userId: whatsappAccount.userId,
    whatsappAccountId: whatsappAccount._id,
    botConfigId: bot._id,
    customerPhone,
    customerName
  });

  chat.messages.push({
    role: "user",
    content: body
  });

  const recentMessages = chat.messages
    .filter(message => message.role !== "system")
    .slice(-10);

  const messages = [
    {
      role: "system",
      content: bot.systemPrompt
    },
    ...recentMessages
  ];

  const completion =
    await openai.chat.completions.create({
      model: "gpt-4",
      messages
    });

  const reply =
    completion.choices[0].message.content;

  chat.messages.push({
    role: "assistant",
    content: reply
  });

  chat.greeted = true;

  await chat.save();

  return {
    reply
  };
};