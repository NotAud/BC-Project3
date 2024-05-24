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

  const apolloServer = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: resolvers,
    context: ({ req }) => ({ req }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  io.on("connection", (socket) => {
    console.log("a user connected");
    socket.join("main");

    socket.on("createLobby", (lobbyData: any) => {
      io.to("main").emit("lobbyCreated", lobbyData);
    });

    socket.on("joinLobby", (lobbyId: string) => {
      socket.join(lobbyId);
      io.to(lobbyId).emit("userJoined", lobbyId);
    });

    socket.on("leaveLobby", (lobbyId) => {
      socket.leave(lobbyId);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });

  httpServer.listen(port, () => {
    console.log(`Listening on port ${port}...`);
    console.log(
      `GraphQL ready at http://localhost:${port}${apolloServer.graphqlPath}`
    );
  });
}

main();
