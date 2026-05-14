import { Router } from "express";
import { getTasks, createTask } from "../controllers/task.controller";

const router: Router = Router();

router.route("/tasks").get(getTasks).post(createTask);

export default router;
