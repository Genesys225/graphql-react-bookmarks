import { gql } from "apollo-boost";

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

export { GET_TOKEN, GET_USERID };
