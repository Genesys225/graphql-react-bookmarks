import { gql } from "apollo-boost";

const CREATE_EVENT = gql`
  mutation CreateEvent($title: String!, $description: String!, $price: Float!, $date: String!) {
    createEvent(
      eventInput: { title: $title, description: $description, price: $price, date: $date }
    ) {
      _id
      title
      description
      date
      price
      __typename
      creator {
        _id
        email
        __typename
      }
    }
  }
`;

const FETCH_EVENTS = gql`
  query fetchEvents {
    events {
      _id
      title
      description
      date
      price
      __typename
      creator {
        _id
        email
        __typename
      }
    }
  }
`;

const SELECTED_EVENT = gql`
  query selectedEvent {
    selectedEvent @client {
      date
      price
      title
      description
      _id
      __typename
    }
  }
`;

const FETCH_EVENTS_CACHED = gql`
  query GetCahedEvents {
    events @client {
      _id
      title
      description
      date
      price
      __typename
      creator @client {
        _id
        email
        __typename
      }
    }
  }
`;

export { CREATE_EVENT, FETCH_EVENTS, SELECTED_EVENT, FETCH_EVENTS_CACHED };
