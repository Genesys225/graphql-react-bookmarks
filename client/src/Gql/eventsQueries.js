import { gql } from "apollo-boost";

export const CREATE_EVENT = gql`
  mutation CreateEvent($title: String!, $description: String!, $price: Float!, $date: String!) {
    createEvent(
      eventInput: { title: $title, description: $description, price: $price, date: $date }
    ) {
      _id
      title
      description
      date
      price
      creator {
        _id
        email
      }
    }
  }
`;

export const FETCH_EVENTS = gql`
  query fetchEvents {
    events {
      __typename
      _id
      title
      description
      date
      price
      creator {
        _id
        email
      }
    }
  }
`;

export const SELECT_EVENT = gql`
  query selectedEvent {
    selectedEvent @client {
      __typename
      date
      price
      title
      description
      _id
    }
  }
`;

export const FETCH_EVENTS_CACHED = gql`
  query GetCahedEvents {
    events @client {
      __typename
      _id
      title
      description
      date
      price
      creator {
        _id
        email
      }
    }
  }
`;
