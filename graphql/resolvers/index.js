const bcrypt = require("bcryptjs");

const Event = require("../../models/event");

const User = require("../../models/user");

const events = async eventIds => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    events.map(event => {
      return {
        ...event._doc,
        _id: eventIds.id,
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, event.creator)
      };
    });
    return events;
  } catch (err) {
    throw err;
  }
};

const user = async userId => {
  const user = await User.findById(userId);
  try {
    return { ...user._doc, _id: user.id, createdEvents: events.bind(this, user.createdEvents) };
  } catch (err) {
    throw err;
  }
};

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map(event => {
        return {
          ...event._doc,
          _id: event.id,
          date: new Date(event._doc.date).toISOString(),
          creator: user.bind(this, event._doc.creator)
        };
      });
    } catch (err) {
      throw err;
    }
  },

  createEvent: async args => {
    const { title, description, price, date } = args.eventInput;
    const event = new Event({
      title,
      description,
      price: +price,
      date: new Date(date),
      creator: "5cbb7ee60eaa91f512351c1f"
    });
    let createdEvent;
    try {
      const result = await event.save();
      createdEvent = {
        ...result._doc,
        _id: result.id,
        date: new Date(result._doc.date).toISOString(),
        creator: user.bind(this, result._doc.creator)
      };
      const creator = await User.findById("5cbb7ee60eaa91f512351c1f");
      if (!creator) {
        throw new Error("User exists already.");
      }
      creator.createdEvents.push(event);
      await creator.save();
      return createdEvent;
    } catch (err) {
      throw err;
    }
  },

  createUser: async args => {
    const { email, password } = args.userInput;
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error("User exists already.");
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({
        email,
        password: hashedPassword
      });
      const result = await user.save();
      return { ...result._doc, _id: result.id };
    } catch (err) {
      throw err;
    }
  }
};
