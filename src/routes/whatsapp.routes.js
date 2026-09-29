// routes/whatsapp.routes.js

import express from "express";

import {
  receiveWhatsAppMessage
} from "../controllers/whatsapp.controller.js";

const router = express.Router();

router.post(
  "/webhook",
  receiveWhatsAppMessage
);

export default router;