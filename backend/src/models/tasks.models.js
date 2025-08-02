import mongoose,{Schema} from "mongoose";

const taskSchema = new Schema(
  {
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "in_progress"],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    dueDate: {
      type: Date,
      required: true,
    },
    documents: [
      {
        type: String, // URL of the document
      }
    ]
  },
  {
    timestamps: true,
  }
);

export const Task = mongoose.model("Task", taskSchema);