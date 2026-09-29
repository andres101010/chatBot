import User from "../db/models/User.js";

export const createUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "name, email y password son requeridos"
      });
    }

    const existingUser = await User.findOne({
      email
    });

    if (existingUser) {
      return res.status(409).json({
        message: "El usuario ya existe"
      });
    }

    const user = await User.create({
      name,
      email,
      password
    });

    return res.status(201).json({
      message: "Usuario creado correctamente",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error("Error creando usuario:", error);

    return res.status(500).json({
      message: "Error interno del servidor"
    });
  }
};