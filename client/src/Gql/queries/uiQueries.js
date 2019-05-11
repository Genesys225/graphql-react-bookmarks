import { gql } from "apollo-boost";

const CREATE_EVENT_MODAL = gql`
  {
    createEventModal @client
  }
`;
const EVENT_DETAILS_MODAL = gql`
  {
    eventDetailsModal @client
  }
`;

export { CREATE_EVENT_MODAL, EVENT_DETAILS_MODAL };
