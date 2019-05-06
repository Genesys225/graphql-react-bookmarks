import { gql } from "apollo-boost";

export const CREATE_EVENT_MODAL = gql`
  {
    createEventModal @client
  }
`;
export const EVENT_DETAILS_MODAL = gql`
  {
    eventDetailsModal @client
  }
`;
