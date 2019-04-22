const Event = require("../../models/event");
const { normalizeEvent } = require("./merge");
const User = require("../../models/user");

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map(event => {
        return normalizeEvent(event);
      });
    } catch (err) {
      throw err;
    }
  },

  createEvent: async (args, req) => {
    if (!req.isAuth) throw new Error("Unauthenticated");
    const { title, description, price, date } = args.eventInput;
    const event = new Event({
      title,
      description,
      price: +price,
      date: new Date(date),
      creator: req.user.id
    });
    let createdEvent;
    try {
      const result = await event.save();
      createdEvent = normalizeEvent(result);
      const creator = await User.findById(req.user.id);
      if (!creator) {
        throw new Error("User exists already.");
      }
      creator.createdEvents.push(event);
      await creator.save();

      return createdEvent;
    } catch (err) {
      throw err;
    }
  }
};
