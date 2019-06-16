import { gql } from "apollo-boost";
import { SINGLE_EVENT } from "./eventsQueries";

const SINGLE_BOOKING = gql`
  fragment detailedBooking on Booking {
    updatedAt
    createdAt
    __typename
  }
`;

// const GET_SINGLE_BOOKING = gql`

// `

const SET_USER_BOOKINGS = gql`
  mutation setUserBookings($selectedEvent: Event!, $newBooking: Booking!) {
    setUserBookings(selectedEvent: $selectedEvent, newBooking: $newBooking) @client
  }
`;

const GET_BOOKINGS_CACHED = gql`
  query getCachedBookings {
    bookings @client {
      ...detailedBooking
      event {
        ...detailedEvent
      }
    }
  }
  ${SINGLE_BOOKING}
  ${SINGLE_EVENT}
`;

export { GET_BOOKINGS_CACHED, SINGLE_BOOKING, SET_USER_BOOKINGS };
