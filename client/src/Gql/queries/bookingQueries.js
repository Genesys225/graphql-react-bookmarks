import { gql } from "apollo-boost";

const BOOK_EVENT = gql`
  mutation bookEvent($id: ID!) {
    bookEvent(eventId: $id) {
      _id
      createdAt
      updatedAt
      __typename
    }
  }
`;

const GET_BOOKINGS = gql`
  query fetchBookings {
    bookings {
      _id
      createdAt
      updatedAt
      __typename
      event {
        _id
        title
        date
        __typename
      }
    }
  }
`;

const GET_BOOKINGS_CACHED = gql`
  query getCachedBookings {
    bookings @client {
      _id
      createdAt
      __typename
      event @client {
        _id
        title
        date
        __typename
      }
    }
  }
`;

const CANCEL_BOOKING = gql`
  mutation CancelBooking($id: ID!) {
    cancelBooking(bookingId: $id) {
      _id
      title
      __typename
    }
  }
`;

export { BOOK_EVENT, GET_BOOKINGS, GET_BOOKINGS_CACHED, CANCEL_BOOKING };
