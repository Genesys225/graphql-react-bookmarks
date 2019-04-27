import React, { useState, useEffect, useContext } from "react";
import Spinner from "../components/Spinner/Spinner";
import BookingList from "../components/BookingList/BookingList";
import AuthContext from "../context/auth-context";

function BookingsPage() {
  const auth = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchBookings();
    return;
  }, []);

  const cancelBookingHandler = async bookingId => {
    setIsLoading(true);
    const requestBody = {
      query: `
        mutation CancelBooking($id: ID!) {
            cancelBooking(bookingId: $id) {
            _id
            title
          }
        }
      `,
      variables: {
        id: bookingId
      }
    };
    try {
      const result = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token
        }
      });

      if (result.status !== 200 && result.status !== 201) {
        throw new Error("Failed!");
      }

      const jsonResult = await result.json();
      const updatedClientBookings = bookings.filter(booking => booking._id !== bookingId);
      await setBookings(updatedClientBookings);
      await setIsLoading(false);
    } catch (error) {
      await setIsLoading(false);
      console.log(error);
    }
  };

  const fetchBookings = async () => {
    setIsLoading(true);
    const requestBody = {
      query: `
        query {
            bookings {
            _id
            createdAt
            event {
              _id
              title
              date
            }
        }
      }
    `
    };
    try {
      const result = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token
        }
      });

      if (result.status !== 200 && result.status !== 201) {
        throw new Error("Failed!");
      }

      const jsonResult = await result.json();
      await setBookings(jsonResult.data.bookings);
      await setIsLoading(false);
    } catch (error) {
      await setIsLoading(false);
      console.log(error);
    }
  };

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <BookingList bookings={bookings} onCancelBooking={cancelBookingHandler} />
      )}
    </>
  );
}

export default BookingsPage;
