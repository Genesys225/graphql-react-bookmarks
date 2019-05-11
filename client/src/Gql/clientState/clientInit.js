import ApolloClient, { InMemoryCache } from "apollo-boost";
import networkMiddleware from "../networkMiddleware";
import clientState from "./clientState";
import { persistCache } from "apollo-cache-persist";
import onError from "../errorHandaling";

const cache = new InMemoryCache({
  // dataIdFromObject: object => {
  //   switch (object.__typename) {
  //     case "bookEvent":
  //       return "bookings";
  //     case "User":
  //       return "users";
  //     case "Event":
  //       return "events";
  //     default:
  //       return object.key;
  //   }
  // }
  cacheRedirects: {
    Query: {
      bookings: (_, args, { getCacheKey }) => console.log(_, args)
    }
  }
});

const initClient = async () => {
  const client = new ApolloClient({
    cache,
    uri: "http://localhost:5000/graphql",
    fetchOptions: {
      credentials: "include"
    },
    clientState: { defaults: clientState.defaults },
    request: operation => networkMiddleware(operation, client),
    onError
  });
  await client.writeData({ data: clientState.defaults });
  await persistCache({
    cache: cache,
    storage: window.localStorage
  });
  return client;
};
export default initClient;
