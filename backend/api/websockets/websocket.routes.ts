import express from "express";
import lobbyWebsocket from "./lobby";
import type expressWs from "express-ws";

const router = express.Router() as expressWs.Router;

router.use("/lobbies", lobbyWebsocket);

export default router;
