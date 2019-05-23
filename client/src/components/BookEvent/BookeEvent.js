import React, { useContext } from "react";
import { useQuery, useMutation, useApolloClient } from "react-apollo-hooks";
import Modal from "../Modal/Modal";
import { SELECTED_EVENT, BOOK_EVENT, SET_USER_BOOKINGS } from "../../Gql/queries";
import authContext from "../../context/authContext";
import Form, { FormField } from "../Form/Form";
import axios from "axios";

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

  const uploadFile = async ({ fileUpload },onUploadProgress) => {
    const formData = new FormData();
    formData.append("fileUpload", fileUpload);
    try {
      const res = await axios.post("http://localhost:5000/api/uploads", formData, {
        headers: {
          "Content-Type": "multipart/form-date",
          Authorization: `Bearer ${token}`
        },
        onUploadProgress: ProgressEvent => onUploadProgress()
      });
      console.log(res.data);
    } catch (error) {}
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
          <div>
            <Form canAltAction={false} canConfirm={false} submitForm={uploadFile}>
              <FormField progress={}>File Upload</FormField>
            </Form>
          </div>
        </>
      )}
    </Modal>
  );
}
