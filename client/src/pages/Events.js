import React, { useRef, useContext } from "react";
import { Query, Mutation, withApollo } from "react-apollo";

import {
  CREATE_EVENT,
  FETCH_EVENTS,
  BOOK_EVENT,
  SELECT_EVENT,
  GET_BOOKINGS_CACHED,
  FETCH_EVENTS_CACHED,
  CREATE_EVENT_MODAL
} from "../Gql";

import Modal from "../components/Modal/Modal";
import Backdrop from "../components/Backdrop/Backdrop";
import AuthContext from "../context/auth-context";
import EventList from "../components/EventList/EventList";
import Spinner from "../components/Spinner/Spinner";
import "./Events.css";

const EventsPage = props => {
  const { client } = props;
  const auth = useContext(AuthContext);

  const titleElRef = useRef(null);
  const priceElRef = useRef(null);
  const dateElRef = useRef(null);
  const descriptionElRef = useRef(null);

  const openCreateEventModal = state =>
    client.writeData({
      data: { createEventModal: state }
    });

  const setSelectedEvent = data => client.writeData({ data: { selectedEvent: data } });

  const createEventHandler = async () => {
    const inputTitle = titleElRef.current.value;
    const inputPrice = +priceElRef.current.value;
    const inputDate = dateElRef.current.value;
    const inputDescription = descriptionElRef.current.value;
    if (
      inputTitle.trim().length === 0 ||
      inputPrice.length <= 0 ||
      inputDate.trim().length === 0 ||
      inputDescription.trim().length === 0
    )
      return;

    const {
      data: { createEvent }
    } = await client.mutate({
      mutation: CREATE_EVENT,
      variables: {
        title: inputTitle,
        description: inputDescription,
        date: inputDate,
        price: inputPrice
      }
    });

    const { events } = await client.readQuery({ query: FETCH_EVENTS_CACHED });
    console.log(createEvent);
    events.push(createEvent);
    client.writeData({ data: { events } });
    console.log(client.cache);
    openCreateEventModal(false);
  };

  const modalCancelHandler = () => {
    setSelectedEvent(null);
    openCreateEventModal(false);
  };

  const showDetailHandler = async eventId => {
    const { events } = await client.readQuery({ query: FETCH_EVENTS_CACHED });
    const foundSelectedEvent = events.find(event => event._id === eventId);
    setSelectedEvent(foundSelectedEvent);
  };

  return (
    <>
      <Query query={CREATE_EVENT_MODAL}>
        {({ data: { createEventModal } }) => (
          <>
            {createEventModal && <Backdrop />}
            <Modal
              isOpen={createEventModal}
              title="Add Event"
              canCancel
              canConfirm
              onCancel={modalCancelHandler}
              onConfirm={createEventHandler}
              confirmText={"Confirm"}
            >
              <form>
                <div className="form-control">
                  <label htmlFor="title">Title</label>
                  <input type="text" id="title" ref={titleElRef} required />
                </div>
                <div className="form-control">
                  <label htmlFor="price">Price</label>
                  <input type="number" id="price" ref={priceElRef} required />
                </div>
                <div className="form-control">
                  <label htmlFor="date">Date</label>
                  <input type="datetime-local" id="date" ref={dateElRef} required />
                </div>
                <div className="form-control">
                  <label htmlFor="description">Description</label>
                  <textarea id="description" rows="4" ref={descriptionElRef} required />
                </div>
              </form>
            </Modal>
          </>
        )}
      </Query>

      <Query query={SELECT_EVENT}>
        {({ data: { selectedEvent } }) => {
          return selectedEvent ? (
            <Mutation mutation={BOOK_EVENT}>
              {(bookEvent, { loading }) => {
                const bookEventHandler = async () => {
                  if (!auth.token) {
                    setSelectedEvent(null);
                    return;
                  }
                  const {
                    data: { bookEvent: newBooking }
                  } = await bookEvent({
                    variables: {
                      id: selectedEvent._id
                    }
                  });
                  const { bookings: cachedBookings } = client.readQuery({
                    query: GET_BOOKINGS_CACHED
                  });
                  newBooking.event = { ...selectedEvent };
                  client.writeData({ data: { bookings: cachedBookings.push(newBooking) } });
                  setSelectedEvent(null);
                };

                return (
                  <>
                    <Backdrop />
                    <Modal
                      isOpen={true}
                      title={selectedEvent.title}
                      canCancel
                      canConfirm
                      onCancel={modalCancelHandler}
                      onConfirm={bookEventHandler}
                      confirmText={"Book"}
                    >
                      {loading && <Spinner />}
                      {!loading && (
                        <>
                          <h1>{selectedEvent.title}</h1>
                          <h2>
                            {selectedEvent.price} -{" "}
                            {new Date(selectedEvent.date).toLocaleDateString("de-DE")}
                          </h2>
                          <p>{selectedEvent.description}</p>
                        </>
                      )}
                    </Modal>
                  </>
                );
              }}
            </Mutation>
          ) : null;
        }}
      </Query>

      {auth.token && (
        <div className="events-control">
          <p>Share your own Events!</p>
          <button className="btn" onClick={() => openCreateEventModal(true)}>
            Create Event
          </button>
        </div>
      )}
      <Query query={FETCH_EVENTS}>
        {({ data: { events }, loading, client }) => {
          console.log(!!auth.token);
          if (loading) return <Spinner />;

          return (
            <EventList onEventDetail={showDetailHandler} events={events} authUserId={auth.userId} />
          );
        }}
      </Query>
    </>
  );
};

export default withApollo(EventsPage);
