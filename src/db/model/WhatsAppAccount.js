const whatsappAccountSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    phoneNumber: {
      type: String,
      required: true,
      trim: true
    },

    phoneNumberId: {
      type: String,
      required: true,
      unique: true
    },

    businessAccountId: {
      type: String
    },

    accessToken: {
      type: String,
      required: true,
      select: false
    },

    status: {
      type: String,
      enum: ["active", "inactive", "disconnected"],
      default: "active"
    }
  },
  {
    timestamps: true
  }
);

const WhatsAppAccount = mongoose.model(
  "WhatsAppAccount",
  whatsappAccountSchema
);

export default WhatsAppAccount;