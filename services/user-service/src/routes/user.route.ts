import { Router } from "express";
import { createUser, getUsers } from "../controllers/user.controller";

const router: Router = Router();

router.route("/users").get(getUsers).post(createUser);

export default router;
