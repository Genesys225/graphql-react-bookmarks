const DataLoader = require("dataLoader");
const Event = require("../../models/event");
const User = require("../../models/user");
const { dateToString } = require("../../utilities/date");

const eventLoader = new DataLoader(eventIds => {
  return events(eventIds);
});

const userLoader = new DataLoader(userIds => {
  return User.find({ _id: { $in: userIds } });
});

const events = async eventIds => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    return await events.map(event => {
      return normalizeEvent(event);
    });
  } catch (err) {
    throw err;
  }
};

const singleEvent = async eventId => {
  try {
    const event = await eventLoader.load(eventId.toString());
    return event;
  } catch (error) {
    throw error;
  }
};

const user = async userId => {
  const user = await userLoader.load(userId.toString());
  try {
    return {
      ...user._doc,
      _id: user.id,
      createdEvents: () => eventLoader.loadMany(user.createdEvents)
    };
  } catch (err) {
    throw err;
  }
};

const normalizeEvent = event => {
  return {
    ...event._doc,
    _id: event.id,
    date: dateToString(event._doc.date),
    creator: user.bind(this, event.creator)
  };
};

const normalizeBooking = booking => {
  return {
    ...booking._doc,
    _id: booking.id,
    user: user.bind(this, booking._doc.user),
    event: singleEvent.bind(this, booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt)
  };
};

// exports.user = user;
// exports.singleEvent = singleEvent;
exports.normalizeEvent = normalizeEvent;
exports.normalizeBooking = normalizeBooking;
// exports.events = events;
