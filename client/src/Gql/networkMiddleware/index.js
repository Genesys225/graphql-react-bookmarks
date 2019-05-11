import { GET_BOOKINGS, GET_BOOKINGS_CACHED, GET_TOKEN, FETCH_EVENTS } from "../queries";

let firstBookingsRead = true;
let firstEventsRead = true;
export default async (operation, client) => {
  switch (operation.operationName) {
    case "CancelBooking":
      const { id: canceledBookingId } = operation.variables;
      const { bookings } = client.readQuery({ query: GET_BOOKINGS_CACHED });
      const updatedBookings = bookings.filter(booking => booking._id !== canceledBookingId);
      client.writeData({
        data: { bookings: updatedBookings }
      });
      break;

    case "bookEvent":
      firstBookingsRead && client.query({ query: GET_BOOKINGS, fetchPolicy: "network-only" });
      firstBookingsRead = false;
      break;

    case "fetchBookings":
      firstBookingsRead = false;
      break;

    case "Login":
      client.query({ query: FETCH_EVENTS, fetchPolicy: "network-only" });
      firstBookingsRead = true;
      firstEventsRead = true;
      console.log(firstEventsRead);
      break;

    case "fetchEvents":
      firstEventsRead = false;
      break;

    default:
      break;
  }
  console.log(operation.operationName);

  const { token } = client.readQuery({ query: GET_TOKEN });
  operation.setContext({
    headers: {
      Authorization: "Bearer " + token
    }
  });
};
