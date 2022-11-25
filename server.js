import { ApolloServer, gql } from "apollo-server";
import { ApolloServerPluginCacheControl } from "apollo-server-core";

const typeDefs = gql`
  type Query {
    text: String
  }
`;

const server = new ApolloServer({ typeDefs });

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});
