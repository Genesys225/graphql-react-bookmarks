import React from "react";
import EventItem from "./EventItem/EventItem";

import "./EventItem.css";

const eventList = props => {
  console.log(props);
  const events = props.events.map(event => (
    <EventItem
      key={event.id}
      eventId={event.id}
      title={event.title}
      price={event.price}
      date={event.date}
      userId={props.authUserId}
      creatorId={event.creator.id}
      onDetail={props.onEventDetail}
    />
  ));

  return <ul className="events__list">{events}</ul>;
};

export default eventList;
