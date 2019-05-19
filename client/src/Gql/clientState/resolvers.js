import { SINGLE_EVENT, GET_BOOKINGS_CACHED } from "../queries";
export default {
  Query: {
    authState: (_, __, { cache }) => {
      const { authState } = cache.data.data;
      console.log(authState);
      return authState;
    }
  },
  Mutation: {
    setSelectedEvent: (_, variables, { cache, getCacheKey }) => {
      const id = getCacheKey({ __typename: "Event", id: variables.id });
      const selectedEvent = cache.readFragment({ fragment: SINGLE_EVENT, id });
      cache.writeData({ data: { selectedEvent } });
      return null;
    },
    setUserBookings: (_, variables, { cache }) => {
      const { selectedEvent, newBooking } = variables;
      let { bookings: cachedBookings } = cache.readQuery({
        query: GET_BOOKINGS_CACHED
      });
      newBooking.event = selectedEvent;
      cachedBookings.push(newBooking);
      cache.writeQuery({
        query: GET_BOOKINGS_CACHED,
        data: { bookings: cachedBookings }
      });

      return null;
    }
  }
};
