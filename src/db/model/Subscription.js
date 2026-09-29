const subscriptionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    plan: {
      type: String,
      enum: ["free", "basic", "pro", "enterprise"],
      default: "free"
    },

    status: {
      type: String,
      enum: [
        "active",
        "trialing",
        "past_due",
        "cancelled",
        "expired"
      ],
      default: "trialing"
    },

    startDate: {
      type: Date,
      default: Date.now
    },

    endDate: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

const Subscription = mongoose.model(
  "Subscription",
  subscriptionSchema
);

export default Subscription;