import Subscription from "../db/models/Subscription.js";
import User from "../db/models/User.js";

export const createSubscription = async (req, res) => {
  try {
    const {
      userId,
      plan
    } = req.body;

    if (!userId || !plan) {
      return res.status(400).json({
        message: "userId y plan son requeridos"
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado"
      });
    }

    const existingSubscription = await Subscription.findOne({
      userId
    });

    if (existingSubscription) {
      return res.status(409).json({
        message: "El usuario ya tiene una suscripción"
      });
    }

    const subscription = await Subscription.create({
      userId,
      plan,
      status: "active"
    });

    return res.status(201).json({
      message: "Suscripción creada correctamente",
      subscription
    });

  } catch (error) {
    console.error("Error creando suscripción:", error);

    return res.status(500).json({
      message: "Error interno del servidor"
    });
  }
};