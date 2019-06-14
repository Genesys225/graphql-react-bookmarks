import React, { useContext, useState } from "react";
import { CREATE_EVENT } from "../../Gql/queries";
import { useMutation } from "react-apollo-hooks";
import Modal from "../Modal/Modal";
import Form, { FormField } from "../Form";
import authContext from "../../context/authContext";

export default function CreateEventComp(props) {
  const [modalShow, setModalShow] = useState(false);
  const { events } = props;
  const {
    auth: { token } // user token retrieved from user-state context passed frop App.js
  } = useContext(authContext);

  // mutation fnction decliration for creating an event
  const createEventReq = useMutation(CREATE_EVENT, {
    update: (client, { data: { createEvent } }) => {
      events.push(createEvent);
      client.writeData({ data: { events: events } });
      openCreateEventModal(false);
    }
  });

  // setting the modal show / hide
  const openCreateEventModal = state => setModalShow(state);

  // the actual call to the mutation function
  // after getting the details from the form
  const createEventHandler = async ({ title, description, price, date }) => {
    createEventReq({
      mutation: CREATE_EVENT,
      variables: {
        title: title.value,
        description: description.value,
        price: price.value,
        date: date.value
      }
    });
    openCreateEventModal(false);
  };

  return (
    <>
      <Modal
        isOpen={modalShow}
        id={"createEventModal"}
        title="Add Event"
        canCancel={false}
        canConfirm={false}
        onCancel={() => openCreateEventModal(false)}
      >
        <Form
          className="create-event-form"
          id="create-event-form"
          canAltAction
          canConfirm
          submitForm={createEventHandler}
          altAction={() => openCreateEventModal(false)}
          confirmBtnText="Confirm"
          altBtnText="Cancel"
        >
          <FormField>Title</FormField>
          <FormField>Price</FormField>
          <FormField>Date</FormField>
          <FormField rows="3" minLength="2">
            Description
          </FormField>
        </Form>
      </Modal>
      {token && (
        // create event button
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
