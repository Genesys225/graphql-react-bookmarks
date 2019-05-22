import React, { useContext } from "react";
import { useQuery, useMutation, useApolloClient } from "react-apollo-hooks";
import Modal from "../Modal/Modal";
import { SELECTED_EVENT, BOOK_EVENT, SET_USER_BOOKINGS } from "../../Gql/queries";
import authContext from "../../context/authContext";
import Form, { FormField } from "../Form/Form";

export default function BookEventComp() {
  const client = useApolloClient();
  const {
    auth: { token }
  } = useContext(authContext);
  const {
    data: { selectedEvent }
  } = useQuery(SELECTED_EVENT);

  const setUserBookings = useMutation(SET_USER_BOOKINGS);

  const bookEvent = useMutation(BOOK_EVENT, {
    update: (_, { data: { bookEvent: newBooking } }) => {
      setUserBookings({
        variables: { selectedEvent, newBooking }
      });
    }
  });

  const bookEventHandler = () => {
    if (!token) {
      nullSelectedEvent();
      return;
    }
    const { id } = selectedEvent;
    bookEvent({ variables: { id } });
    nullSelectedEvent();
  };

  const modalCancelHandler = () => nullSelectedEvent();

  const nullSelectedEvent = () => client.writeData({ data: { selectedEvent: null } });

  return (
    <Modal
      id="bookEventModal"
      isOpen={!!selectedEvent}
      title={selectedEvent && selectedEvent.title}
      canCancel
      canConfirm
      onCancel={modalCancelHandler}
      onConfirm={bookEventHandler}
      confirmText={"Book"}
    >
      {selectedEvent && (
        <>
          <h1>{selectedEvent.title}</h1>
          <h2>
            {selectedEvent.price} - {new Date(selectedEvent.date).toLocaleDateString("de-DE")}
          </h2>
          <p>{selectedEvent.description}</p>
          <Form>
            <FormField type="file">File Upload</FormField>
          </Form>
        </>
      )}
    </Modal>
  );
}
