import React, { useRef, useState, useContext } from "react";
import { withApollo } from "react-apollo";
import { LOGIN, SIGN_UP } from "../Gql/authQueries";

import "./Auth.css";
import AuthContext from "../context/auth-context";

const AuthPage = props => {
  const auth = useContext(AuthContext);
  const emailEl = useRef(null);
  const passwordEl = useRef(null);
  const [isLogin, setIsLogin] = useState(true);

  const switchModeHandler = () => {
    const prevState = isLogin;
    setIsLogin(!prevState);
  };

  const submitHandler = async event => {
    event.preventDefault();
    const email = emailEl.current.value;
    const password = passwordEl.current.value;

    if (email.trim().length === 0 || password.trim().length === 0) return;

    const loginData = await props.client.query({
      query: isLogin ? LOGIN : SIGN_UP,
      variables: {
        email,
        password
      },
      fetchPolicy: "no-cache"
    });

    const { token, userId, tokenExpiration } = loginData.data.login;
    if (token) {
      auth.login(token, userId, tokenExpiration);
    }
  };

  return (
    <>
      <h1>{isLogin ? "Login" : "Sign up"} Page</h1>
      <form className="auth-form" onSubmit={submitHandler}>
        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" ref={emailEl} />
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" ref={passwordEl} />
        </div>
        <div className="form-actions">
          <button type="submit">Submit</button>
          <button type="button" onClick={switchModeHandler}>
            Switch to {isLogin ? "Sign up" : "Login"}
          </button>
        </div>
      </form>
    </>
  );
};
export default withApollo(AuthPage);
