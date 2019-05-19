import { GET_BOOKINGS, GET_BOOKINGS_CACHED, GET_AUTH_STATE } from "../queries";
//this is where you would catch network requests before they lieve
let firstBookingsRead = true;
export default async (operation, client) => {
  switch (operation.operationName) {
    case "CancelBooking":
      const { id: canceledBookingId } = operation.variables;
      const { bookings } = client.readQuery({ query: GET_BOOKINGS_CACHED });
      const updatedBookings = bookings.filter(booking => booking.id !== canceledBookingId);
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
      firstBookingsRead = true;
      break;

    case "fetchEvents":
      break;

    default:
      break;
  }
  console.log(operation);

  const {
    authState: { token }
  } = client.readQuery({ query: GET_AUTH_STATE });
  operation.setContext({
    headers: {
      Authorization: "Bearer " + token
    }
  });
};
