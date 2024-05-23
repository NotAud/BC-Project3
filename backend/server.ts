import express from "express";
import expressWs from "express-ws";
import { dbConn } from "./database/connection.ts";
import { ApolloServer } from "apollo-server-express";

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

  const server = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: resolvers,
  });

  await server.start();
  server.applyMiddleware({ app });

  app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
    console.log(
      `GraphQL ready at http://localhost:${port}${server.graphqlPath}`
    );
  });
}

main();
