import React, { Suspense, lazy, useContext } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import "./App.css";
import { GET_AUTH_STATE } from "./Gql/queries";
import { useQuery } from "react-apollo-hooks";
import AuthContext from "./context/authContext";
import Spinner from "./components/Spinner/Spinner";
import { useApolloClient } from "react-apollo-hooks";
import RestartClientContext from "./context/RestartClientContext";

// lazy allowes to wait for import untill triggered by the render method
const AuthPage = lazy(() => import("./pages/Auth"));
const BookingsPage = lazy(() => import("./pages/Bookings"));
const EventsPage = lazy(() => import("./pages/Events"));
const MainNavigation = lazy(() => import("./components/Navigation/MainNavigation"));

function App() {
  const client = useApolloClient();
  const authContext = useContext(AuthContext);
  const { restartClient } = useContext(RestartClientContext);
  // becouse auth state is rarely changed it is read once every change
  // and then gets distributed via the context
  let {
    data: { authState: auth }
  } = useQuery(GET_AUTH_STATE);
  const token = auth.token;
  const documentClick = () => {
    if (auth.tokenExpiration <= new Date() / 1000) authContext.logout(client, restartClient);
    console.log((auth.tokenExpiration - new Date() / 1000) / 60);
  };
  if (token) document.addEventListener("click", documentClick);
  auth = { ...authContext, ...auth };
  return (
    <BrowserRouter>
      <AuthContext.Provider value={{ auth }}>
        <MainNavigation />
        <main className="main-content">
          <Suspense fallback={<Spinner />}>
            <Switch>
              {!token && document.removeEventListener("click", documentClick)}
              {token && <Redirect from="/" to="/events" exact />}
              {token && <Redirect from="/auth" to="/events" exact />}
              {!token && <Route path="/auth" component={AuthPage} />}
              <Route path="/events" component={EventsPage} />
              {token && <Route path="/bookings" component={BookingsPage} />}
              {!token && <Redirect to="/auth" exact />} {/*// if not logged in and not events*/}
            </Switch>
          </Suspense>
        </main>
      </AuthContext.Provider>
    </BrowserRouter>
  );
}

export default App;

Array.prototype.contains = function(obj) {
  return this.indexOf(obj) > -1;
};
