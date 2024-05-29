import express from "express";
import expressWs from "express-ws";
import { dbConn } from "./database/connection.js";
import { ApolloServer } from "apollo-server-express";
import { Server } from "socket.io";
import { createServer } from "http";

import { fileURLToPath } from "url";
import path from "path";

import typeDefs from "./database/schema.js";
import resolvers from "./database/resolvers.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function createApp() {
  await dbConn();

  const { app } = expressWs(express());

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/dist")));

    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../client/dist/index.html"));
    });
  }

  return app;
}

async function main() {
  const app = await createApp();

  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinMain", () => {
      socket.join("main");
    });

    socket.on("joinLobby", (lobbyId) => {
      socket.rooms.forEach((room) => {
        socket.leave(room);
      });

      socket.join(lobbyId);
    });

    socket.on("answer", (lobbyId, userId, score) => {
      io.to(lobbyId).emit("answer", userId, score);
    });

    socket.on("disconnect", () => {});
  });

  const apolloServer = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: resolvers,
    context: ({ req }) => ({ req, io }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  const port = process.env.PORT || 8080;
  httpServer.listen(port, () => {
    console.log(`Listening on port ${port}...`);
    console.log(
      `GraphQL ready at http://localhost:${port}${apolloServer.graphqlPath}`
    );
  });
}

main();
