import ApolloClient, { InMemoryCache } from "apollo-boost";
import networkMiddleware from "../networkMiddleware";
import clientState from "./clientState";
import { persistCache } from "apollo-cache-persist";
import onError from "../errorHandaling";

const cache = new InMemoryCache({
  cacheRedirects: {
    Query: {
      fetchBookings: (_, args, { getCacheKey }) => {
        console.log(args);
        return getCacheKey({ __typename: "Booking", id: args });
      }
    }
  },
  dataIdFromObject: object => {
    console.log(object, object.id);
    return object.id;
  }
});

const initClient = async () => {
  const client = new ApolloClient({
    cache,
    uri: "http://localhost:5000/graphql",
    fetchOptions: {
      credentials: "include"
    },
    request: operation => networkMiddleware(operation, client),
    onError,
    clientState
  });
  await client.writeData({ data: clientState.defaults });
  await persistCache({
    cache: cache,
    storage: window.localStorage
  });
  console.log(clientState);
  return client;
};
export default initClient;
