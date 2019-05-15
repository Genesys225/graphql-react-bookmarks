import { gql } from "apollo-boost";

const LOGIN = gql`
  query Login($email: String!, $password: String!) {
    login(userInput: { email: $email, password: $password }) {
      userId
      token
      tokenExpiration
      __typename
    }
  }
`;

const SIGN_UP = gql`
  mutation SignUp($email: String!, $password: String!) {
    createUser(userInput: { email: $email, password: $password }) {
      id
      email
      __typename
    }
  }
`;

export { LOGIN, SIGN_UP };
