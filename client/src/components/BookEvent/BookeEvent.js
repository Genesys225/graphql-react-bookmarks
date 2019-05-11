import React, { useState } from "react";
import { useQuery, useMutation, useApolloClient } from "react-apollo-hooks";
import Backdrop from "../Backdrop/Backdrop";
import Modal from "../Modal/Modal";
import { SELECTED_EVENT, BOOK_EVENT, GET_BOOKINGS_CACHED, GET_TOKEN } from "../../Gql/queries";
import Spinner from "../Spinner/Spinner";

export default function BookEventComp() {
  const [loading, setLoading] = useState(false);
  const client = useApolloClient();

  const {
    data: { selectedEvent }
  } = useQuery(SELECTED_EVENT);
  const bookEvent = useMutation(BOOK_EVENT, {
    update: (client, { data: { bookEvent: newBooking } }) => {
      let { bookings: cachedBookings } = client.readQuery({
        query: GET_BOOKINGS_CACHED
      });
      newBooking.event = selectedEvent;
      cachedBookings.push(newBooking);
      client.writeQuery({
        query: GET_BOOKINGS_CACHED,
        data: { bookings: cachedBookings }
      });
      setLoading(false);
      setSelectedEvent(null);
    }
  });

  const bookEventHandler = () => {
    setLoading(true);

    const { token } = client.readQuery({ query: GET_TOKEN });
    if (!token) {
      setSelectedEvent(null);
      return;
    }
    bookEvent({
      variables: {
        id: selectedEvent._id
      }
    });
  };
  const modalCancelHandler = () => {
    setSelectedEvent(null);
  };
  const setSelectedEvent = data => client.writeData({ data: { selectedEvent: data } });

  return (
    <>
      {selectedEvent && <Backdrop />}
      {selectedEvent ? (
        <Modal
          isOpen={selectedEvent}
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
                {selectedEvent.price} - {new Date(selectedEvent.date).toLocaleDateString("de-DE")}
              </h2>
              <p>{selectedEvent.description}</p>
            </>
          )}
        </Modal>
      ) : null}
    </>
  );
}
