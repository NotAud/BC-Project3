import express from "express";
import apiRoutes from "./endpoints/api.routes";

const router = express.Router();

router.use("/api", apiRoutes);

export default router;
