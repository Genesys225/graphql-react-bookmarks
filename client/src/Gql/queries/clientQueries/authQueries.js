import { gql } from "apollo-boost";

const GET_TOKEN = gql`
  {
    token
  }
`;

const GET_AUTH_STATE = gql`
  query getAuthState {
    getAuthState @client {
      token
      userId
      tokenExpiration
    }
  }
`;

const GET_USERID = gql`
  {
    userId
  }
`;
const GET_TOKEN_EXP = gql`
  {
    tokenExpiration
  }
`;

export { GET_TOKEN, GET_USERID, GET_TOKEN_EXP, GET_AUTH_STATE };
