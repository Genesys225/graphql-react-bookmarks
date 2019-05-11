import React, { useEffect } from "react";
import Spinner from "../components/Spinner/Spinner";
import BookingList from "../components/BookingList/BookingList";
import { CANCEL_BOOKING, GET_BOOKINGS } from "../Gql/queries";
import { useQuery, useMutation } from "react-apollo-hooks";

export default function BookingsPage() {
  const {
    data: { bookings },
    loading,
    refetch
  } = useQuery(GET_BOOKINGS, { suspend: false });

  useEffect(() => {
    if ((!bookings || bookings.length < 1) && !loading) {
      refetch();
    }
  }, []);

  const cancelBooking = useMutation(CANCEL_BOOKING, {
    suspend: false
  });

  const cancelBookingHandler = bookingIdParam => {
    cancelBooking({
      variables: {
        id: bookingIdParam
      }
    });
  };

  if (loading) return <Spinner />;
  if ((!bookings || bookings.length < 1) && !loading) return null;

  return <BookingList bookings={bookings} onCancelBooking={cancelBookingHandler} />;
}
