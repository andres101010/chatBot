// import mongoose, { Schema } from "mongoose";

// const messageSchema = new Schema({
//   role: {
//     type: String,
//     enum: ["user", "assistant", "system"],
//     required: true
//   },
//   content: {
//     type: String,
//     required: true
//   },
//   timestamp: {
//     type: Date,
//     default: Date.now
//   }
// });

// const chatMemorySchema = new Schema({
//   userId: {
//     type: String, // o Schema.Types.ObjectId si tienes un modelo `User`
//     required: true
//   },
//   title: {
//     type: String, // Nombre opcional de la conversación
//     default: "Nueva conversación"
//   },
//   name: {
//     type:String,
//     required: true
//   },
//   messages: [messageSchema],
//   greeted: {
//     type: Boolean,
//     default: false
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// // Autoactualiza updatedAt cuando se modifica
// chatMemorySchema.pre('save', function (next) {
//   this.updatedAt = new Date();
//   next();
// });

// const ChatMemory = mongoose.model('ChatMemory', chatMemorySchema);
// export default ChatMemory;


const messageSchema = new Schema(
  {
    role: {
      type: String,
      enum: ["user", "assistant", "system"],
      required: true
    },

    content: {
      type: String,
      required: true
    },

    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  {
    _id: true
  }
);

const chatMemorySchema = new Schema(
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

    botConfigId: {
      type: Schema.Types.ObjectId,
      ref: "BotConfig",
      required: true,
      index: true
    },

    customerPhone: {
      type: String,
      required: true,
      index: true
    },

    customerName: {
      type: String,
      trim: true
    },

    title: {
      type: String,
      default: "Nueva conversación"
    },

    messages: {
      type: [messageSchema],
      default: []
    },

    greeted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

chatMemorySchema.index({
  userId: 1,
  whatsappAccountId: 1,
  customerPhone: 1
});

const ChatMemory = mongoose.model(
  "ChatMemory",
  chatMemorySchema
);

export default ChatMemory;