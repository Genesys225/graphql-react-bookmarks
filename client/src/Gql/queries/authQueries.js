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
      _id
      email
      __typename
    }
  }
`;

const GET_TOKEN = gql`
  {
    token
  }
`;

const GET_USERID = gql`
  {
    userId
  }
`;

export { LOGIN, SIGN_UP, GET_TOKEN, GET_USERID };
