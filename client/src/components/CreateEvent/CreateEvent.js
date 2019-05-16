import React, { useContext } from "react";
import { CREATE_EVENT_MODAL, FETCH_EVENTS_CACHED, CREATE_EVENT } from "../../Gql/queries";
import { useQuery, useMutation, useApolloClient } from "react-apollo-hooks";
import Modal from "../Modal/Modal";
import Backdrop from "../Backdrop/Backdrop";
import Form, { FormField } from "../Form/Form";
import authContext from "../../context/authContext";

export default function CreateEventComp() {
  const { token } = useContext(authContext);
  const client = useApolloClient();

  const {
    data: { events }
  } = useQuery(FETCH_EVENTS_CACHED);

  const {
    data: { createEventModal }
  } = useQuery(CREATE_EVENT_MODAL);

  const createEventReq = useMutation(CREATE_EVENT, {
    update: (client, { data: { createEvent } }) => {
      events.push(createEvent);
      client.writeData({ data: { events: events } });
      openCreateEventModal(false);
    }
  });

  const openCreateEventModal = state =>
    client.writeData({
      data: { createEventModal: state }
    });

  const modalCancelHandler = () => openCreateEventModal(false);

  const createEventHandler = async ({ title, price, date, description }) => {
    createEventReq({
      mutation: CREATE_EVENT,
      variables: {
        title,
        description,
        date,
        price
      }
    });
  };

  return (
    <>
      {createEventModal && <Backdrop />}
      <Modal isOpen={createEventModal} title="Add Event" canCancel={false} canConfirm={false}>
        <Form
          canAltAction
          canConfirm
          submitForm={createEventHandler}
          altAction={modalCancelHandler}
          confirmBtnText="Confirm"
          altBtnText="Cancel"
        >
          <FormField>Title</FormField>
          <FormField>Price</FormField>
          <FormField>Date</FormField>
          <FormField>Description</FormField>
        </Form>
      </Modal>
      {token && (
        <div className="events-control">
          <p>Share your own Events!</p>
          <button className="btn" onClick={() => openCreateEventModal(true)}>
            Create Event
          </button>
        </div>
      )}
    </>
  );
}
