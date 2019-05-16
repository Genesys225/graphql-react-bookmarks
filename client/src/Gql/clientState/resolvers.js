import {
  SINGLE_EVENT,
  GET_BOOKINGS_CACHED,
  GET_TOKEN_EXP,
  GET_TOKEN,
  GET_USERID
} from "../queries";
export default {
  Query: {
    getAuthState: (_, __, { cache }) => {
      const { token } = cache.readQuery({ query: GET_TOKEN });
      const { userId } = cache.readQuery({ query: GET_USERID });
      const { tokenExpiration } = cache.readQuery({ query: GET_TOKEN_EXP });
      console.log(token, userId, tokenExpiration);
      return { token, userId, tokenExpiration, __typename: "Auth" };
    }
  },
  Mutation: {
    setSelectedEvent: (_, variables, { cache, getCacheKey }) => {
      const id = getCacheKey({ __typename: "Event", id: variables.id });
      console.log(id);
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
