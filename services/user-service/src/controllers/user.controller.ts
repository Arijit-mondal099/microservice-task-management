import { Request, Response } from "express";
import { User } from "../models/user.model";

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find().lean();
    return res.status(200).json( users );
  } catch (error: unknown) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body as { name: string; email: string };
    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }
    const newUser = await User.create({ name, email });
    return res.status(201).json({ ...newUser.toObject() });
  } catch (error: unknown) {
    console.error("Error creating user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
