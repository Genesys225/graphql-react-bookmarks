import React, { useEffect } from "react";
import BookingList from "../components/BookingList/BookingList";
import { CANCEL_BOOKING, GET_BOOKINGS } from "../Gql/queries";
import { useQuery, useMutation } from "react-apollo-hooks";

export default function BookingsPage() {
  const {
    data: { bookings },
    refetch
  } = useQuery(GET_BOOKINGS);

  useEffect(() => {
    if (!bookings || bookings.length < 1) {
      refetch();
    }
  }, []);

  const cancelBooking = useMutation(CANCEL_BOOKING);

  const cancelBookingHandler = bookingId => {
    cancelBooking({
      variables: {
        id: bookingId
      }
    });
  };

  return <BookingList bookings={bookings} onCancelBooking={cancelBookingHandler} />;
}
