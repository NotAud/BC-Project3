import express from "express";
import { lobbies, createLobby } from "./lobbyManager";
import type expressWs from "express-ws";

const router = express.Router() as expressWs.Router;

type WebsocketMessage = {
  type: string;
  payload?: any;
};

router.ws("/", (ws, req) => {
  ws.on("message", (msg: string) => {
    const data: WebsocketMessage = JSON.parse(msg);
    console.log(data);
    switch (data.type) {
      case "list":
        ws.send(JSON.stringify(lobbies));
        break;
      case "create":
        createLobby(data.payload);
        break;
      default:
        ws.send("Invalid message type");
    }
  });
});

export default router;
