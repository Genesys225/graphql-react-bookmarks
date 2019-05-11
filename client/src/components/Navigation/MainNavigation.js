import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { useQuery, useApolloClient } from "react-apollo-hooks";
import { GET_TOKEN } from "../../Gql/queries";
import clientState from "../../Gql/clientState/clientState";

import "./MainNavigation.css";
import RestartClientContext from "../../context/RestartClientContext";

const MainNavigation = () => {
  const { restartClient } = useContext(RestartClientContext);
  const client = useApolloClient();
  const {
    data: { token }
  } = useQuery(GET_TOKEN);

  const logout = async () => {
    await client.clearStore();
    await window.localStorage.clear();
    await client.writeData({ data: clientState.defaults });
    restartClient();
    await console.log(clientState.defaults, client.cache.data.data);
  };
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
                <button onClick={logout}>Logout</button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
