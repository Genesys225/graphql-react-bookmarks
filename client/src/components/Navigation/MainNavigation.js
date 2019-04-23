import React, { useContext } from "react";
import { NavLink } from "react-router-dom";

import AuthContext from "../../context/auth-context";
import "./MainNavigation.css";

const MainNavigation = props => {
  const auth = useContext(AuthContext);
  return (
    <header className="main-navigation">
      <div className="main-navigation__logo" />
      <h1>EasyEvent</h1>
      <nav className="main-navigation__items">
        <ul>
          {!auth.token && (
            <li>
              <NavLink to="/auth">Authentication</NavLink>
            </li>
          )}
          <li>
            <NavLink to="/events">Events</NavLink>
          </li>
          {auth.token && (
            <>
              <li>
                <NavLink to="/bookings">Bookings</NavLink>
              </li>
              <li>
                <button onClick={auth.logout}>Logout</button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;