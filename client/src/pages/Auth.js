import React, { useState } from "react";
import { LOGIN, SIGN_UP } from "../Gql/queries/";
import { useApolloClient, useMutation } from "react-apollo-hooks";

import "./Auth.css";
import Form, { FormField as newFormField } from "../components/Form/Form";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const client = useApolloClient();
  const signUpReq = useMutation(SIGN_UP, {
    fetchPolicy: "no-cache"
  });

  const switchModeHandler = () => {
    const prevState = isLogin;
    setIsLogin(!prevState);
  };

  const submitHandler = async ({ email, password }) => {
    console.log(email, password);

    if (isLogin) {
      const {
        data: {
          login: { token, userId, tokenExpiration }
        }
      } = await client.query({
        query: LOGIN,
        variables: {
          email,
          password
        },
        fetchPolicy: "no-cache"
      });
      console.log(token, userId);
      if (token) {
        client.writeData({ data: { token, userId } });
      }
    } else
      signUpReq({
        variables: {
          email,
          password
        }
      });
  };

  return (
    <>
      <h1>{isLogin ? "Login" : "Sign up"} Page</h1>
      <Form
        submitForm={submitHandler}
        canConfirm
        canAlternative
        altAction={switchModeHandler}
        confirmBtnText={isLogin ? "Sign up" : "Login"}
        altBtnText={`Switch to ${isLogin ? "Sign up" : "Login"}`}
      >
        <newFormField>Email</newFormField>
        <newFormField minLength="5">Password</newFormField>
      </Form>
    </>
  );
};
export default AuthPage;
