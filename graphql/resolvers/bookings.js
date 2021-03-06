const Event = require("../../models/event");
const Booking = require("../../models/booking");
const { normalizeBooking } = require("./merge");
const { normalizeEvent } = require("./merge");

module.exports = {
  RootQuery: {
    bookings: async (_, args, req) => {
      if (!req.isAuth) throw new Error("Unauthenticated");
      try {
        const bookings = await Booking.find({ user: req.userId });
        return bookings.map(booking => {
          return normalizeBooking(booking);
        });
      } catch (error) {
        console.log(error);
        throw error;
      }
    }
  },
  RootMutation: {
    bookEvent: async (_, args, req) => {
      if (!req.isAuth) throw new Error("Unauthenticated");
      const event = await Event.findOne({ _id: args.eventId });
      
      const booking = new Booking({
        user: req.userId,
        event
      });
      const result = await booking.save();
      
      return normalizeBooking(result);
    },

    cancelBooking: async (_, args, req) => {
      if (!req.isAuth) throw new Error("Unauthenticated");
      try {
        const booking = await Booking.findById(args.bookingId).populate("event");
        const event = normalizeEvent(booking.event);
        await Booking.findByIdAndDelete(args.bookingId);
        return event;
      } catch (error) {
        throw error;
      }
    }
  }
};
