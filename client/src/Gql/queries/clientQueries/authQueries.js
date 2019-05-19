import { gql } from "apollo-boost";

const GET_AUTH_STATE = gql`
  query authState {
    authState @client {
      token
      userId
      tokenExpiration
      __typename
      id
    }
  }
`;

export { GET_AUTH_STATE };
