import React from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import AuthPage from "./pages/Auth";
import BookingsPage from "./pages/Bookings";
import EventsPage from "./pages/Events";
import MainNavigation from "./components/Navigation/MainNavigation";

import "./App.css";
import { GET_TOKEN } from "./Gql/queries";
import { useQuery } from "react-apollo-hooks";

function App() {
  const {
    data: { token }
  } = useQuery(GET_TOKEN);
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

export default App;
