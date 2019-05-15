import { gql } from "apollo-boost";

const SINGLE_EVENT = gql`
  fragment detailedEvent on Event {
    date
    price
    title
    description
    id
    __typename
  }
`;

const SELECTED_EVENT = gql`
  query selectedEvent {
    selectedEvent @client {
      ...detailedEvent
    }
  }
  ${SINGLE_EVENT}
`;

const SET_SELECTED_EVENT = gql`
  mutation SetSelectedEvent($id: Int!) {
    setSelectedEvent(id: $id) @client
  }
`;

const FETCH_EVENTS_CACHED = gql`
  query GetCahedEvents {
    events @client {
      ...SELECTED_EVENT_fragment
      creator @client {
        id
        email
        __typename
      }
    }
  }
`;

export { SELECTED_EVENT, FETCH_EVENTS_CACHED, SET_SELECTED_EVENT, SINGLE_EVENT };
