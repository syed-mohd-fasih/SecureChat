import express from "express";

import protectedRoute from "../middleware/protectedRoute.js";
import { getUsersForSidebar } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", protectedRoute, getUsersForSidebar);

export default router;
