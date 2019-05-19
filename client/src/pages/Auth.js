import React, { useState } from "react";
import { LOGIN, SIGN_UP } from "../Gql/queries/";
import { useApolloClient, useMutation } from "react-apollo-hooks";
import Form, { FormField } from "../components/Form/Form";

import "./Auth.css";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const client = useApolloClient();

  const signUpReq = useMutation(SIGN_UP, {
    fetchPolicy: "no-cache"
  });

  const submitHandler = async creds => {
    if (isLogin) {
      const {
        data: { login: authState }
      } = await client.query({
        query: LOGIN,
        variables: creds,
        fetchPolicy: "no-cache"
      });
      if (authState) {
        const data = { authState: { ...authState, id: 1, __typename: "Auth" } };
        client.writeData({ data });
      }
    } else signUpReq({ variables: creds });
  };
  return (
    <>
      <h1>{isLogin ? "Login" : "Sign up"} Page</h1>
      <Form
        className="auth-form"
        submitForm={submitHandler}
        canConfirm
        canAltAction
        altAction={() => setIsLogin(!isLogin)}
        confirmBtnText={!isLogin ? "Sign up" : "Login"}
        altBtnText={`Switch to ${isLogin ? "Sign up" : "Login"}`}
      >
        <FormField>Email</FormField>
        <FormField minLength="5">Password</FormField>
      </Form>
    </>
  );
};
export default AuthPage;
