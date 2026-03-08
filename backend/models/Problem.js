import mongoose from "mongoose";

const problemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    problem: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      default: "general",
      trim: true
    },
    aiResponse: {
      type: String,
      required: true
    }
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: false }
  }
);

const Problem = mongoose.model("Problem", problemSchema);

export default Problem;

