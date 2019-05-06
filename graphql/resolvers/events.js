const Event = require("../../models/event");
const { normalizeEvent } = require("./merge");
const User = require("../../models/user");

module.exports = {
  RootQuery: {
    events: async () => {
      try {
        const events = await Event.find();
        return events.map(event => {
          return normalizeEvent(event);
        });
      } catch (err) {
        throw err;
      }
    }
  },
  RootMutation: {
    createEvent: async (_, args, context) => {
      if (!context.isAuth) throw new Error("Unauthenticated");
      const { title, description, price, date } = args.eventInput;
      const event = new Event({
        title,
        description,
        price: +price,
        date: new Date(date),
        creator: context.userId
      });
      let createdEvent;
      try {
        const result = await event.save();
        createdEvent = normalizeEvent(result);
        const creator = await User.findById(context.userId);
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
  }
};
