import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom";
import { ApolloProvider as ApolloProviderHooks } from "react-apollo-hooks";
import "./index.css";
import initClient from "./Gql/clientState/clientInit";
import Spinner from "./components/Spinner/Spinner";
import RestartClientContext from "./context/RestartClientContext";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import "popper.js/dist/popper.js";
import "jquery/dist/jquery.js";

const App = lazy(() => import("./App"));

const setupAndRender = async () => {
  let client = await initClient();
  const restartClient = () => setupAndRender();
  ReactDOM.render(
    <React.StrictMode>
      <Suspense fallback={<Spinner />}>
        <ApolloProviderHooks client={client}>
          <RestartClientContext.Provider value={{ restartClient }}>
            <App />
          </RestartClientContext.Provider>
        </ApolloProviderHooks>
      </Suspense>
    </React.StrictMode>,
    document.getElementById("root")
  );
};

export default setupAndRender();
