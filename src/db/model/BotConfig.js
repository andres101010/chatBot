const botConfigSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    whatsappAccountId: {
      type: Schema.Types.ObjectId,
      ref: "WhatsAppAccount",
      required: true,
      index: true
    },

    name: {
      type: String,
      required: true
    },

    systemPrompt: {
      type: String,
      default: ""
    },

    active: {
      type: Boolean,
      default: true
    },

    greeting: {
      type: String,
      default: ""
    },

    greetingEnabled: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const BotConfig = mongoose.model(
  "BotConfig",
  botConfigSchema
);

export default BotConfig;