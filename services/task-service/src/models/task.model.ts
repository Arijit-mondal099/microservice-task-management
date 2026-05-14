import mongoose from "mongoose";

export interface ITask extends mongoose.Document {
  title: string;
  description: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema: mongoose.Schema<ITask> = new mongoose.Schema<ITask>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    userId: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export const Task =
  (mongoose.models.Task as mongoose.Model<ITask>) || mongoose.model<ITask>("Task", taskSchema);
