import React from "react";
import Spinner from "../components/Spinner/Spinner";
import BookingList from "../components/BookingList/BookingList";
import { Query, withApollo } from "react-apollo";
import { GET_BOOKINGS, CANCEL_BOOKING } from "../Gql";

const BookingsPage = props => {
  const { client } = props;

  const cancelBookingHandler = async bookingId => {
    await client.mutate({
      mutation: CANCEL_BOOKING,
      variables: {
        id: bookingId
      }
    });
  };

  return (
    <Query query={GET_BOOKINGS}>
      {({ data, loading, client }) => {
        if (loading) return <Spinner />;
        const { bookings } = data;
        return <BookingList bookings={bookings} onCancelBooking={cancelBookingHandler} />;
      }}
    </Query>
  );
};

export default withApollo(BookingsPage);
