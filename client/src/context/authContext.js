import React from "react";
import clientState from "../Gql/clientState/clientState";

export default React.createContext({
  token: null,
  userId: null,
  tokenExpiration: null,
  logout: async (client, restartClient) => {
    await client.clearStore();
    await window.localStorage.clear();
    await client.writeData({ data: clientState.defaults });
    restartClient();
    await console.log(clientState.defaults);
  }
});
