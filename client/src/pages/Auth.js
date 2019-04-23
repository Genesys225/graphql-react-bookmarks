import React, { useRef, useState, useContext } from "react";

import "./Auth.css";
import AuthContext from "../context/auth-context";

const AuthPage = () => {
  const auth = useContext(AuthContext);
  const emailEl = useRef(null);
  const passwordEl = useRef(null);
  const [isLogin, setIsLogin] = useState(true);

  const switchModeHandler = () => {
    const prevState = isLogin;
    setIsLogin(!prevState);
  };

  const submitHandler = event => {
    event.preventDefault();
    const email = emailEl.current.value;
    const password = passwordEl.current.value;

    if (email.trim().length === 0 || password.trim().length === 0) return;

    let requestBody = {
      query: `
        query {
          login(email:"${email}", password:"${password}") {
            userId
            token
            tokenExpiration
          }
        }
      `
    };
    if (!isLogin) {
      requestBody = {
        query: `
        mutation {
          createUser(userInput:{email:"${email}", password:"${password}"}) {
            _id
            email
          }
        }
      `
      };
    }

    fetch("http://localhost:5000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then(resData => {
        const { token, userId, tokenExpiration } = resData.data.login;
        if (token) {
          auth.login(token, userId, tokenExpiration);
        }
      })
      .catch(err => {
        console.log(err);
      });
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
export default AuthPage;
