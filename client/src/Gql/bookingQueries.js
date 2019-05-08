import { gql } from "apollo-boost";

export const BOOK_EVENT = gql`
  mutation bookEvent($id: ID!) {
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
      _id
      createdAt
      updatedAt
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
      _id
      createdAt
      event @client {
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
