import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { useApolloClient } from "react-apollo-hooks";

import "./MainNavigation.css";
import RestartClientContext from "../../context/RestartClientContext";
import authContext from "../../context/authContext";

const MainNavigation = () => {
  const { restartClient } = useContext(RestartClientContext);
  const {
    auth: { token, logout }
  } = useContext(authContext);
  const client = useApolloClient();
  return (
    <header className="main-navigation">
      <div className="main-navigation__logo" />
      <h1>EasyEvent</h1>
      <nav className="main-navigation__items">
        <ul>
          {!token && (
            <li>
              <NavLink to="/auth">Authentication</NavLink>
            </li>
          )}
          <li>
            <NavLink to="/events">Events</NavLink>
          </li>
          {token && (
            <>
              <li>
                <NavLink to="/bookings">Bookings</NavLink>
              </li>
              <li>
                <button onClick={() => logout(client, restartClient)}>Logout</button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
