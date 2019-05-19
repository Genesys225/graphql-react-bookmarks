import resolvers from "./resolvers";

export default {
  defaults: {
    createEventModal: false,
    selectedEvent: null,
    events: [],
    bookings: [],
    authState: {
      token: null,
      userId: null,
      tokenExpiration: null,
      __typename: "Auth",
      id: 1
    }
  },
  resolvers
};
