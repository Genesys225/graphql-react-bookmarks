import React from "react";
import "./BookingLis.css";

const BookingList = props => {
  return (
    <ul className="booking__list">
      {props.bookings.map(booking => (
        <li className="booking__list-item" key={booking._id}>
          <div className="booking__item-data">
            {booking.event.title} - {new Date(booking.createdAt).toLocaleDateString("de-DE")} -{" "}
            {booking._id}
          </div>
          <div className="booking__item-actions">
            <button className="btn" onClick={props.onCancelBooking.bind(this, booking._id)}>
              Cancel
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default BookingList;
