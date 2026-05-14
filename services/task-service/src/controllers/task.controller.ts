import { Request, Response } from "express";
import { Task } from "../models/task.model";

export const getTasks = async (_req: Request, res: Response) => {
  try {
    const tasks = await Task.find().lean();
    return res.status(200).json( tasks );
  } catch (error: unknown) {
    console.error("Error fetching tasks:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, userId } = req.body as { title: string; description: string; userId: string };
    if (!title || !description || !userId) {
      return res.status(400).json({ message: "Title, description, and user ID are required" });
    }
    const newTask = await Task.create({ title, description, userId });
    return res.status(201).json({ ...newTask.toObject() });
  } catch (error: unknown) {
    console.error("Error creating task:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


