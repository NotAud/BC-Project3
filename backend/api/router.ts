import express from "express";
import apiRoutes from "./endpoints/api.routes";
import wsRoutes from "./websockets/websocket.routes";
import type expressWs from "express-ws";

const router = express.Router() as expressWs.Router;

// router.use("/api", apiRoutes);
router.use("/ws", wsRoutes);

export default router;
