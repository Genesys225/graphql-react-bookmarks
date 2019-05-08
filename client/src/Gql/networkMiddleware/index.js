import { GET_BOOKINGS, GET_BOOKINGS_CACHED } from "../";

export default async (operation, client) => {
  let firstBookingsRead = true;
  switch (operation.operationName) {
    case "CancelBooking":
      const { id: cancelededBookingId } = operation.variables;
      const { bookings } = client.readQuery({ query: GET_BOOKINGS_CACHED });
      const updatedBookings = bookings.filter(booking => booking._id !== cancelededBookingId);
      client.writeData({
        data: { bookings: updatedBookings }
      });
      break;
    case "getCachedBookings":
      firstBookingsRead && (await client.query({ query: GET_BOOKINGS }));
      console.log(firstBookingsRead);
      firstBookingsRead = false;
      break;
    case "bookEvent":
      // firstBookingsRead && (await client.query({ query: GET_BOOKINGS }));
      firstBookingsRead = false;
      break;
    case "fetchBookings":
      firstBookingsRead = false;
      break;
    // case "fetchBookings":
    //   cachedBookings = client.readQuery({ query: GET_BOOKINGS_CACHED });
    //   console.log(cachedBookings);
    //   !cachedBookings &&
    //     client.writeData({
    //       data: {
    //         bookings: []
    //       }
    //     });
    //   // const { id: bookedEventID } = operation.variables;
    // break;
    default:
      console.log(operation);
  }

  operation.setContext({
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("token")
    }
  });
};
