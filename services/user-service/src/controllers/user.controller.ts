import { Request, Response } from "express";
import { User } from "../models/user.model";

export const getUsers = (_req: Request, res: Response) => {
  try {
    const users = User.find();
    return res.status(200).json(users);
  } catch (error: unknown) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createUser = (req: Request, res: Response) => {
  try {
    const { name, email } = req.body as { name: string; email: string };
    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }
    const newUser = new User({ name, email });
    newUser.save();
    return res.status(201).json(newUser);
  } catch (error: unknown) {
    console.error("Error creating user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
