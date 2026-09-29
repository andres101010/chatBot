
// import { openai } from "./openAi.js";
// import { getOrCreateChat } from "../controllers/getOrCreateChat.js";

// let fallbackPrompt = `
// Eres un asistente de ventas especializado en autopartes.

// Tu función es ayudar a los clientes a encontrar piezas como baterías, bujías, amortiguadores, pastillas de freno, filtros y más. 
// Solo puedes ofrecer información sobre los productos que están disponibles en el sistema actual (por ejemplo, en una tabla o base de datos).
// ❗️ Si un repuesto no aparece en el sistema, **NO asumas ni inventes** que está disponible.

// No puedes agregar productos a un carrito, procesar compras, enviar correos electrónicos ni confirmar pedidos. Si el cliente menciona alguna de estas acciones, responde con amabilidad que por ahora solo puedes ofrecer información de los repuestos disponibles.

// Siempre responde solo en español y con un tono amable, claro y profesional.

// Si el usuario pregunta sobre algo fuera del mundo de las autopartes, sugiere hablar con un vendedor humano o intenta ayudar brevemente.

// `;


// const runChat = async (values, promp) => {
//   try {

//     if(!promp){
//       fallbackPrompt = `Si un usuario pregunta por una pieza de auto específica y no está disponible en el inventario, responde con cordialidad, profesionalismo y disposición de ayuda.

// 1. Inicia el mensaje con una bienvenida clara: 
//    "¡Bienvenidos a Repuestos para Autos Markitos!"

// 2. Luego, solicita amablemente la información necesaria: 
//    "¿Podrías indicarme qué pieza estás buscando y el modelo del auto para poder verificar en nuestros inventarios, por favor?"

// 3. Si la pieza no está disponible:
//    - Responde respetuosamente diciendo que no contamos con stock de dicha pieza en este momento.
//    - Ofrece ayuda adicional: "¿Te gustaría consultar por otra pieza o necesitas algo más?"

// 4. Además, si no se encuentra la pieza:
//    - Informa que también pueden comunicarse con atención al cliente para una búsqueda más detallada o futura disponibilidad.
//    - Por ejemplo: "Si lo deseas, también puedes escribirnos directamente al WhatsApp de atención o visitar nuestra tienda para más opciones."

// Mantén siempre un tono cálido, respetuoso y orientado al cliente. Evita respuestas genéricas como "¿Cómo puedo ayudarte hoy?" y personaliza la interacción en función de las necesidades del usuario.`

//     }

  
//     const chat = await getOrCreateChat(values.id, values.title, values.name);

//     // Si aún no tiene mensaje system, lo agregamos al principio
//     if (!chat.messages.some(m => m.role === "system")) {
//       chat.messages.unshift({
//         role: "system",
//         content: fallbackPrompt,
//       });
//     }

//     // Agregar el mensaje del usuario
//     chat.messages.push({
//       role: "user",
//       content: values.body,
//     });

//     // Tomar últimos 10 mensajes relevantes para la conversación
//     const recentMessages = chat.messages.slice(-10);

//     const completion = await openai.chat.completions.create({
//       model: "gpt-4",
//       messages: recentMessages,
//     });

//     const reply = completion.choices[0].message.content;

//     // Agregar respuesta del asistente al historial
//     chat.messages.push({
//       role: "assistant",
//       content: reply,
//     });

//     await chat.save();

//     console.log("reply", reply)

//     return reply;

//   } catch (error) {
//     console.error("❌ Error al llamar a la API de OpenAI:", error);
//     return "Ocurrió un error al procesar tu solicitud. Por favor, intenta nuevamente.";
//   }
// };

// export default runChat;


import OpenAI from "openai";

import WhatsAppAccount from "../models/WhatsAppAccount.js";
import BotConfig from "../models/BotConfig.js";
import {
  getOrCreateChat
} from "../services/chat.service.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const runChat = async ({
  phoneNumberId,
  customerPhone,
  customerName,
  body
}) => {

  try {

    /*
     * 1. Buscar el WhatsApp que recibió el mensaje
     */

    const whatsappAccount =
      await WhatsAppAccount.findOne({
        phoneNumberId,
        status: "active"
      }).select("+accessToken");

    if (!whatsappAccount) {
      throw new Error(
        "WhatsApp no encontrado"
      );
    }

    /*
     * 2. Buscar el bot de ese WhatsApp
     */

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

    /*
     * 3. Obtener o crear conversación
     */

    const chat = await getOrCreateChat({
      userId: whatsappAccount.userId,
      whatsappAccountId: whatsappAccount._id,
      botConfigId: bot._id,
      customerPhone,
      customerName
    });

    /*
     * 4. Guardar mensaje del usuario
     */

    chat.messages.push({
      role: "user",
      content: body
    });

    /*
     * 5. Construir contexto
     */

    const recentMessages = chat.messages
      .filter(
        message => message.role !== "system"
      )
      .slice(-10);

    const messages = [
      {
        role: "system",
        content: bot.systemPrompt
      },
      ...recentMessages
    ];

    /*
     * 6. Llamar a OpenAI
     */

    const completion =
      await openai.chat.completions.create({
        model: "gpt-4",
        messages
      });

    const reply =
      completion.choices[0].message.content;

    /*
     * 7. Guardar respuesta
     */

    chat.messages.push({
      role: "assistant",
      content: reply
    });

    chat.greeted = true;

    await chat.save();

    return {
      reply,
      chat,
      whatsappAccount,
      bot
    };

  } catch (error) {

    console.error(
      "Error ejecutando chatbot:",
      error
    );

    return {
      reply:
        "Ocurrió un error al procesar tu solicitud. Por favor, intenta nuevamente."
    };
  }
};