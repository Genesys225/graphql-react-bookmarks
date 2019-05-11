import React, { useRef, useState } from "react";
import {
  CREATE_EVENT_MODAL,
  FETCH_EVENTS_CACHED,
  CREATE_EVENT,
  GET_TOKEN
} from "../../Gql/queries";
import { useQuery, useMutation, useApolloClient } from "react-apollo-hooks";
import Modal from "../Modal/Modal";
import Backdrop from "../Backdrop/Backdrop";
import formValidation from "../Form/formValidation";

export default function CreateEventComp() {
  const [formErrors, setFormErrors] = useState({ eventTitleInput: false });
  const formElRef = useRef(null);
  const titleElRef = useRef(null);
  const priceElRef = useRef(null);
  const dateElRef = useRef(null);
  const descriptionElRef = useRef(null);

  const client = useApolloClient();

  const {
    data: { token }
  } = useQuery(GET_TOKEN);

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

  const createEventHandler = async () => {
    const inputTitle = titleElRef.current;
    const inputPrice = priceElRef.current;
    const inputDate = dateElRef.current;
    const inputDescription = descriptionElRef.current;
    formElRef.current.dispatchEvent(new Event("click"));
    const errors = formValidation([inputTitle, inputPrice, inputDate, inputDescription]);

    if (errors) {
      setFormErrors(errors);
      return;
    } else
      createEventReq({
        mutation: CREATE_EVENT,
        variables: {
          title: inputTitle.value,
          description: inputDescription.value,
          date: inputDate.value,
          price: +inputPrice.value
        }
      });
  };

  return (
    <>
      {createEventModal && <Backdrop />}
      <Modal
        isOpen={createEventModal}
        title="Add Event"
        canCancel
        canConfirm={true}
        onCancel={modalCancelHandler}
        onConfirm={createEventHandler}
        confirmText={"Confirm"}
      >
        <form>
          <div className="form-control">
            <label htmlFor="eventTitleInput">
              Title:{" "}
              <div className={formErrors.eventTitleInput ? "validationError" : "validationPassed"}>
                {formErrors.eventTitleInput}
              </div>
            </label>
            <input type="text" id="eventTitleInput" ref={titleElRef} required minLength="2" />
          </div>

          <div className="form-control">
            <label htmlFor="eventPriceInput">
              Price:{" "}
              <div className={formErrors.eventPriceInput ? "validationError" : "validationPassed"}>
                {formErrors.eventPriceInput}
              </div>
            </label>
            <input type="number" id="eventPriceInput" ref={priceElRef} required min="0.1" />
          </div>

          <div className="form-control">
            <label htmlFor="eventDateInput">
              Date:{" "}
              <div
                className={formErrors.eventDateInput ? "validationError" : "validationPassed"}
                display="inline"
              >
                {formErrors.eventDateInput}
              </div>
            </label>
            <input type="datetime-local" id="eventDateInput" ref={dateElRef} required />
          </div>

          <div className="form-control">
            <label htmlFor="eventDescriptionInput">
              Description:{" "}
              <div
                className={
                  formErrors.eventDescriptionInput ? "validationError" : "validationPassed"
                }
              >
                {formErrors.eventDescriptionInput}
              </div>
            </label>
            <textarea id="eventDescriptionInput" rows="4" ref={descriptionElRef} required />
          </div>
          <button
            onClick={e => e.preventDefault()}
            ref={formElRef}
            className="submitButtonHide"
            type="submit"
          />
        </form>
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
