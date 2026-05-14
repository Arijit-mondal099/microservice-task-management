import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema: mongoose.Schema<IUser> = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  },
);

export const User =
  (mongoose.models.User as mongoose.Model<IUser>) || mongoose.model<IUser>("User", userSchema);
