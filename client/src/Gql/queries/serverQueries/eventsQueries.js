import { gql } from "apollo-boost";

import { SINGLE_EVENT } from "../clientQueries/eventsQueries";

const CREATE_EVENT = gql`
  mutation CreateEvent($title: String!, $description: String!, $price: Float!, $date: String!) {
    createEvent(
      eventInput: { title: $title, description: $description, price: $price, date: $date }
    ) {
      ...detailedEvent
      creator {
        id
        email
        __typename
      }
    }
  }
  ${SINGLE_EVENT}
`;

const FETCH_EVENTS = gql`
  query fetchEvents {
    events {
      ...detailedEvent
      creator {
        id
        email
        __typename
      }
    }
  }
  ${SINGLE_EVENT}
`;

export { CREATE_EVENT, FETCH_EVENTS };
