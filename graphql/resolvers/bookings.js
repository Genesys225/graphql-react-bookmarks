const Event = require("../../models/event");
const Booking = require("../../models/booking");
const { normalizeBooking } = require("./merge");

module.exports = {
  bookings: async (args, req) => {
    if (!req.isAuth) throw new Error("Unauthenticated");
    try {
      const bookings = await Booking.find();
      return bookings.map(booking => {
        return normalizeBooking(booking);
      });
    } catch (error) {
      throw error;
    }
  },

  bookEvent: async (args, req) => {
    if (!req.isAuth) throw new Error("Unauthenticated");
    const event = await Event.findOne({ _id: args.eventId });
    const booking = new Booking({
      user: req.user.id,
      event
    });
    const result = await booking.save();
    return normalizeBooking(result);
  },

  cancelBooking: async (args, req) => {
    if (!req.isAuth) throw new Error("Unauthenticated");
    try {
      const booking = await Booking.findById(args.bookingId).populate("event");
      console.log(booking);
      const event = normalizeEvent(booking.event);
      await Booking.findByIdAndDelete(args.bookingId);
      return event;
    } catch (error) {
      throw error;
    }
  }
};