import React, { useContext, lazy, Suspense } from "react";
import { useQuery, useMutation } from "react-apollo-hooks";

import authContext from "../context/authContext";
import { FETCH_EVENTS, SET_SELECTED_EVENT } from "../Gql/queries";

import "./Events.css";
import Spinner from "../components/Spinner/Spinner";
const EventList = lazy(() => import("../components/EventList/EventList"));
const BookEventComp = lazy(() => import("../components/BookEvent/BookeEvent"));
const CreateEventComp = lazy(() => import("../components/CreateEvent/CreateEvent"));

const EventsPage = () => {
  const { auth } = useContext(authContext);
  const {
    data: { events },
    refetch
  } = useQuery(FETCH_EVENTS);

  const setSelectedEvent = useMutation(SET_SELECTED_EVENT);

  const showDetailHandler = async eventId => {
    setSelectedEvent({ variables: { id: eventId } });
    window.$("#bookEventModal").modal("show");
  };

  if (!events || events.length < 1) {
    refetch();
  }
  return (
    <Suspense fallback={<Spinner />}>
      <CreateEventComp events={events} />
      <BookEventComp />
      <EventList onEventDetail={showDetailHandler} events={events} authUserId={auth.userId} />
    </Suspense>
  );
};

export default EventsPage;
