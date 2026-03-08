import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    name: {
      type: String,
      default: ""
    },
    preferences: {
      theme: {
        type: String,
        enum: ["dark", "light"],
        default: "dark"
      },
      aiModel: {
        type: String,
        enum: ["gpt-4", "claude", "gemini", "default"],
        default: "default"
      },
      categories: {
        type: [String],
        default: ["general", "work", "personal", "health", "relationships", "career", "finance"]
      }
    }
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" }
  }
);

const User = mongoose.model("User", userSchema);

export default User;

