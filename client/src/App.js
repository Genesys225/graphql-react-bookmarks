import React, { useState } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import ApolloClient, { InMemoryCache } from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { persistCache } from "apollo-cache-persist";

import networkMiddleware from "./Gql/networkMiddleware";
import onError from "./Gql/errorHandaling";
import AuthPage from "./pages/Auth";
import BookingsPage from "./pages/Bookings";
import EventsPage from "./pages/Events";
import MainNavigation from "./components/Navigation/MainNavigation";
import AuthContext from "./context/auth-context";

import "./App.css";

const cache = new InMemoryCache();

persistCache({
  cache,
  storage: window.localStorage
});

function App() {
  const [token, setToken] = useState(
    sessionStorage.getItem("token") != null ? sessionStorage.getItem("token") : ""
  );
  const [userId, setUserId] = useState(
    sessionStorage.getItem("userId") != null ? sessionStorage.getItem("userId") : ""
  );

  const login = (token, userId, tokenExpiration) => {
    setToken(token);
    setUserId(userId);
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("userId", userId);
    sessionStorage.setItem("tokenExpiration", tokenExpiration);
  };

  const logout = () => {
    window.localStorage.clear();
    sessionStorage.clear();
    client.cache.reset();
    client.resetStore();
    setToken(null);
    setUserId(null);
  };

  const client = new ApolloClient({
    cache,
    uri: "http://localhost:5000/graphql",
    fetchOptions: {
      credentials: "include"
    },
    clientState: {
      defaults: {
        createEventModal: false,
        eventDetailsModal: false,
        selectedEvent: null
      },
      resolvers: {}
    },
    request: operation => networkMiddleware(operation, client),
    onError
  });

  return (
    <BrowserRouter>
      <ApolloProvider client={client}>
        <AuthContext.Provider value={{ token, userId, login, logout }}>
          <MainNavigation />
          <main className="main-content">
            <Switch>
              {token && <Redirect from="/" to="/events" exact />}
              {token && <Redirect from="/auth" to="/events" exact />}
              {!token && <Route path="/auth" component={AuthPage} />}
              <Route path="/events" component={EventsPage} />
              {token && <Route path="/bookings" component={BookingsPage} />}
              {!token && <Redirect to="/auth" exact />} {/*// if not logged in and not events*/}
            </Switch>
          </main>
        </AuthContext.Provider>
      </ApolloProvider>
    </BrowserRouter>
  );
}

export default App;
