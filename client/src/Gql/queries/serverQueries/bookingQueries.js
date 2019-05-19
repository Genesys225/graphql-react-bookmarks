import { gql } from "apollo-boost";

const BOOK_EVENT = gql`
  mutation bookEvent($id: ID!) {
    bookEvent(eventId: $id) {
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;

const GET_BOOKINGS = gql`
  query fetchBookings {
    bookings {
      id
      createdAt
      updatedAt
      __typename
      event {
        id
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
      id
      title
      __typename
    }
  }
`;

export { BOOK_EVENT, GET_BOOKINGS, CANCEL_BOOKING };
