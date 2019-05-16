import React, { useContext } from "react";
import { useQuery, useMutation, useApolloClient } from "react-apollo-hooks";
import Backdrop from "../Backdrop/Backdrop";
import Modal from "../Modal/Modal";
import { SELECTED_EVENT, BOOK_EVENT, SET_USER_BOOKINGS } from "../../Gql/queries";
import authContext from "../../context/authContext";

export default function BookEventComp() {
  const client = useApolloClient();
  const { token } = useContext(authContext);
  const {
    data: { selectedEvent }
  } = useQuery(SELECTED_EVENT);

  const bookEvent = useMutation(BOOK_EVENT, {
    update: (_, { data: { bookEvent: newBooking } }) => {
      client.mutate({
        mutation: SET_USER_BOOKINGS,
        variables: { selectedEvent, newBooking }
      });
    }
  });

  const bookEventHandler = () => {
    if (!token) {
      setSelectedEvent(null);
      return;
    }
    bookEvent({
      variables: {
        id: selectedEvent.id
      }
    });
    setSelectedEvent(null);
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
          <h1>{selectedEvent.title}</h1>
          <h2>
            {selectedEvent.price} - {new Date(selectedEvent.date).toLocaleDateString("de-DE")}
          </h2>
          <p>{selectedEvent.description}</p>
        </Modal>
      ) : null}
    </>
  );
}
