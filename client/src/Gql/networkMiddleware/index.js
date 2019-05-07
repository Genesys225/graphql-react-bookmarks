import { GET_BOOKINGS, GET_BOOKINGS_CACHED } from "../";

export default (operation, client) => {
  switch (operation.operationName) {
    case "CancelBooking":
      const { id: cancelededBookingId } = operation.variables;
      const { bookings } = client.readQuery({ query: GET_BOOKINGS_CACHED });
      const updatedBookings = bookings.filter(booking => booking._id !== cancelededBookingId);
      client.writeData({
        data: { bookings: updatedBookings }
      });
      break;
    case "BookEvent":
      if (!client.cache.data.bookings) {
        client.writeData({
          data: {
            bookings: client.query({ query: GET_BOOKINGS })
          }
        });
        if (!client.cache.data.bookings)
          client.writeData({
            data: {
              bookings: []
            }
          });
      }
      // const { id: bookedEventID } = operation.variables;
      console.log(operation);
      break;
    default:
  }

  operation.setContext({
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("token")
    }
  });
};
