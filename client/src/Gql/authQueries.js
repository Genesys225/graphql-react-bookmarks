import { gql } from "apollo-boost";

const LOGIN = gql`
  query Login($email: String!, $password: String!) {
    login(userInput: { email: $email, password: $password }) {
      userId
      token
      tokenExpiration
    }
  }
`;

const SIGN_UP = gql`
  query Login($email: String!, $password: String!) {
    login(userInput: { email: $email, password: $password }) {
      userId
      token
      tokenExpiration
    }
  }
`;

export { LOGIN, SIGN_UP };
