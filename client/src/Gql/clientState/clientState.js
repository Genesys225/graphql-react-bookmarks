import resolvers from "./resolvers";

export default {
  defaults: {
    createEventModal: false,
    selectedEvent: null,
    events: [],
    bookings: [],
    token: null,
    userId: null,
    tokenExpiration: null
  },
  resolvers
};
