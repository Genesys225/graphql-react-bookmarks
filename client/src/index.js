import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { ApolloProvider as ApolloProviderHooks } from "react-apollo-hooks";

import "./index.css";
import initClient from "./Gql/clientState/clientInit";
import Spinner from "./components/Spinner/Spinner";
import RestartClientContext from "./context/RestartClientContext";

const setupAndRender = async () => {
  let client = await initClient();
  const restartClient = () => setupAndRender();
  if (!client) ReactDOM.render(<Spinner />, document.getElementById("root"));
  ReactDOM.render(
    <ApolloProviderHooks client={client}>
      <RestartClientContext.Provider value={{ restartClient }}>
        <Suspense fallback={<Spinner />}>
          <App />
        </Suspense>
      </RestartClientContext.Provider>
    </ApolloProviderHooks>,
    document.getElementById("root")
  );
};

export default setupAndRender();
