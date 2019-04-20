const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  //_id: ID,
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  createdEvents: [
    {
      type: Schema.Types.ObjectId,
      ref: "Event"
    }
  ]
  // bookings: {
  //   type: Number,
  //   required: true
  // }
});

module.exports = mongoose.model("User", userSchema);
