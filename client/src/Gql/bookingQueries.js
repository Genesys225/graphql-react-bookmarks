import { gql } from "apollo-boost";

export const BOOK_EVENT = gql`
  mutation BookEvent($id: ID!) {
    bookEvent(eventId: $id) {
      _id
      createdAt
      updatedAt
    }
  }
`;

export const GET_BOOKINGS = gql`
  query fetchBookings {
    bookings {
      __typename
      _id
      createdAt
      event {
        _id
        title
        date
      }
    }
  }
`;

export const GET_BOOKINGS_CACHED = gql`
  query getCachedBookings {
    bookings @client {
      __typename
      _id
      createdAt
      event @client {
        __typename
        _id
        title
        date
      }
    }
  }
`;

export const CANCEL_BOOKING = gql`
  mutation CancelBooking($id: ID!) {
    cancelBooking(bookingId: $id) {
      _id
      title
    }
  }
`;
