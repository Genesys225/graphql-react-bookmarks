import React, { useState, useRef, useContext, useEffect } from "react";

import Modal from "../components/Modal/Modal";
import Backdrop from "../components/Backdrop/Backdrop";
import AuthContext from "../context/auth-context";
import EventList from "../components/EventList/EventList";
import Spinner from "../components/Spinner/Spinner";
import "./Events.css";

function EventsPage() {
  const auth = useContext(AuthContext);
  const [pending, setPending] = useState(false);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [pagePresent, setPagePresent] = useState(true);

  const titleElRef = useRef(null);
  const priceElRef = useRef(null);
  const dateElRef = useRef(null);
  const descriptionElRef = useRef(null);

  useEffect(() => {
    fetchEvents();
    return () => {
      setPagePresent(false);
    };
  }, []);

  const startCreateEventHandler = () => {
    setPending(true);
  };

  const modalConfirmHandler = async () => {
    setPending(false);
    const title = titleElRef.current.value;
    const price = +priceElRef.current.value;
    const date = dateElRef.current.value;
    const description = descriptionElRef.current.value;

    if (
      title.trim().length === 0 ||
      price.length <= 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0
    )
      return;

    const event = { title, price, date, description };
    console.log(event);

    const requestBody = {
      query: `
          mutation CreateEvent($title: String!, $description: String!, $price: Float!, $date: String!) {
            createEvent(eventInput: {title: $title, description: $description, price:$price, date: $date}) {
              _id
              title
              description
              date
              price
              creator {
                _id
                email
              }
            }
          }
        `,
      variables: {
        title,
        price,
        date,
        description
      }
    };
    const { token } = auth;
    const response = await fetch("http://localhost:5000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      }
    });
    try {
      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Failed!");
      }
      const jsonResponse = await response.json();

      const updatedEvents = [...events];
      const { _id, title, description, date, price } = jsonResponse.data.createEvent;
      updatedEvents.push({
        _id,
        title,
        description,
        date,
        price,
        creator: {
          _id: auth.userId
        }
      });

      setEvents(updatedEvents);
    } catch (err) {
      console.log(err);
    }
  };

  const modalCancelHandler = () => {
    setPending(false);
    setSelectedEvent(null);
  };

  const fetchEvents = async () => {
    setIsLoading(true);
    const requestBody = {
      query: `
        query {
            events {
            _id
            title
            description
            date
            price
            creator {
                _id
                email
            }
        }
      }
    `
    };
    try {
      const result = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (result.status !== 200 && result.status !== 201) {
        throw new Error("Failed!");
      }

      const jsonResult = await result.json();
      if (pagePresent) {
        setEvents(jsonResult.data.events);
        setIsLoading(false);
      }
    } catch (error) {
      if (pagePresent) {
        setIsLoading(false);
      }
      console.log(error);
    }
  };

  const bookEventHandler = async () => {
    if (!auth.token) {
      setSelectedEvent(null);
      return;
    }
    // setIsLoading(true);
    const requestBody = {
      query: `
        mutation BookEvent($id: ID!) {
            bookEvent(eventId: $id)  {
            _id
            createdAt
            updatedAt
          }
        }
      `,
      variables: {
        id: selectedEvent._id
      }
    };
    try {
      const result = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token
        }
      });
      if (result.status !== 200 && result.status !== 201) {
        throw new Error("Failed!");
      }

      const jsonResult = await result.json();
      console.log(jsonResult);
      setSelectedEvent(null);
      // await setEvents(jsonResult.data.events);
      // await setIsLoading(false);
    } catch (error) {
      await setIsLoading(false);
      console.log(error);
    }
  };

  const showDetailHandler = eventId => {
    const foundSelectedEvent = events.find(event => event._id === eventId);
    setSelectedEvent(foundSelectedEvent);
  };

  return (
    <>
      {(pending || selectedEvent) && <Backdrop />}
      {pending && (
        <Modal
          title="Add Event"
          canCancel
          canConfirm
          onCancel={modalCancelHandler}
          onConfirm={modalConfirmHandler}
          confirmText="Confirm"
        >
          <form>
            <div className="form-control">
              <label htmlFor="title">Title</label>
              <input type="text" id="title" ref={titleElRef} />
            </div>
            <div className="form-control">
              <label htmlFor="price">Price</label>
              <input type="number" id="price" ref={priceElRef} />
            </div>
            <div className="form-control">
              <label htmlFor="date">Date</label>
              <input type="datetime-local" id="date" ref={dateElRef} />
            </div>
            <div className="form-control">
              <label htmlFor="description">Description</label>
              <textarea id="description" rows="4" ref={descriptionElRef} />
            </div>
          </form>
        </Modal>
      )}
      {selectedEvent && (
        <Modal
          title={selectedEvent.title}
          canCancel
          canConfirm
          onCancel={modalCancelHandler}
          onConfirm={bookEventHandler}
          confirmText="Book"
        >
          <h1>{selectedEvent.title}</h1>
          <h2>
            {selectedEvent.price} - {new Date(selectedEvent.date).toLocaleDateString("de-DE")}
          </h2>
          <p>{selectedEvent.description}</p>
        </Modal>
      )}
      {auth.token && (
        <div className="events-control">
          <p>Share your own Events!</p>
          <button className="btn" onClick={startCreateEventHandler}>
            Create Event
          </button>
        </div>
      )}
      {isLoading ? (
        <Spinner />
      ) : (
        <EventList onEventDetail={showDetailHandler} events={events} authUserId={auth.userId} />
      )}
    </>
  );
}

export default EventsPage;
