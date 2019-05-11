import React from "react";
import { useQuery, useApolloClient } from "react-apollo-hooks";

import { FETCH_EVENTS, GET_USERID } from "../Gql/queries";

import EventList from "../components/EventList/EventList";
import "./Events.css";
import BookEventComp from "../components/BookEvent/BookeEvent";
import CreateEventComp from "../components/CreateEvent/CreateEvent";
import Spinner from "../components/Spinner/Spinner";

const EventsPage = () => {
  const client = useApolloClient();
  const {
    data: { events },
    refetch,
    loading
  } = useQuery(FETCH_EVENTS, { suspend: false });

  const {
    data: { userId }
  } = useQuery(GET_USERID);

  const setSelectedEvent = data => client.writeData({ data: { selectedEvent: data } });

  const showDetailHandler = async eventId => {
    const foundSelectedEvent = events.find(event => event._id === eventId);
    setSelectedEvent(foundSelectedEvent);
  };

  const RenderEventList = () => {
    if (!events || events.length < 1) {
      refetch();
      return null;
    }
    return <EventList onEventDetail={showDetailHandler} events={events} authUserId={userId} />;
  };

  return (
    <>
      <CreateEventComp />
      {loading && <Spinner />};
      <BookEventComp />
      <RenderEventList />
    </>
  );
};

export default EventsPage;
