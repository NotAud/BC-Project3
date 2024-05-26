import express from "express";
import expressWs from "express-ws";
import { dbConn } from "./database/connection.ts";
import { ApolloServer } from "apollo-server-express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";

import typeDefs from "./database/schema.ts";
import resolvers from "./database/resolvers.ts";

const port = 8080;

async function createApp() {
  await dbConn();

  const { app } = expressWs(express());

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static("public"));

  app.use((await import("./api/router.ts")).default);

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
    console.log("a user connected");

    socket.on("joinMain", () => {
      socket.join("main");
    });

    socket.on("joinLobby", (lobbyId: string) => {
      socket.rooms.forEach((room) => {
        socket.leave(room);
      });

      socket.join(lobbyId);
    });

    socket.on("answer", (lobbyId: string, userId: string, score: any) => {
      io.to(lobbyId).emit("answer", userId, score);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });

  const apolloServer = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: resolvers,
    context: ({ req }) => ({ req, io }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  httpServer.listen(port, () => {
    console.log(`Listening on port ${port}...`);
    console.log(
      `GraphQL ready at http://localhost:${port}${apolloServer.graphqlPath}`
    );
  });
}

main();
