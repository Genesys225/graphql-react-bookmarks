import React, { useState, useContext } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import AuthPage from "./pages/Auth";
import BookingsPage from "./pages/Bookings";
import EventsPage from "./pages/Events";
import MainNavigation from "./components/Navigation/MainNavigation";

import "./App.css";
import authContext from "./context/authContext";

function App() {
  const context = useContext(authContext);
  const [auth, setAuth] = useState({ context });
  const setAutConextState = newAuth => {
    setAuth(newAuth);
  };
  const { token } = auth;

  return (
    <BrowserRouter>
      <authContext.Provider value={{ auth, setAutConextState }}>
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
      </authContext.Provider>
    </BrowserRouter>
  );
}

export default App;
