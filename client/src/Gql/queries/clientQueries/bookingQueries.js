import { gql } from "apollo-boost";

const SINGLE_BOOKING = gql`
  fragment detailedBooking on Booking {
    id
    updatedAt
    createdAt
    __typename
  }
`;

const GET_BOOKINGS_CACHED = gql`
  query getCachedBookings {
    bookings @client {
      ...detailedBooking
      event @client {
        id
        title
        date
        __typename
      }
    }
  }
  ${SINGLE_BOOKING}
`;

export { GET_BOOKINGS_CACHED, SINGLE_BOOKING };
