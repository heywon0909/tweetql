import { ApolloServer, gql } from "apollo-server";
import { ApolloServerPluginCacheControl } from "apollo-server-core";

const server = new ApolloServer({});

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});
