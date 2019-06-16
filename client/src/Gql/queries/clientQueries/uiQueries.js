import { gql } from "apollo-boost";

const CREATE_EVENT_MODAL = gql`
  {
    createEventModal @client
  }
`;

export { CREATE_EVENT_MODAL };
