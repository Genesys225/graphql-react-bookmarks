import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom";
import { ApolloProvider as ApolloProviderHooks } from "react-apollo-hooks";
import "./index.css";
import initClient from "./Gql/clientState/clientInit";
import Spinner from "./components/Spinner/Spinner";
import RestartClientContext from "./context/RestartClientContext";
const App = lazy(() => import("./App"));

const setupAndRender = async () => {
  let client = await initClient();
  const restartClient = () => setupAndRender();
  ReactDOM.render(
    <Suspense fallback={<Spinner />}>
      <ApolloProviderHooks client={client}>
        <RestartClientContext.Provider value={{ restartClient }}>
          <App />
        </RestartClientContext.Provider>
      </ApolloProviderHooks>
    </Suspense>,
    document.getElementById("root")
  );
};

export default setupAndRender();
