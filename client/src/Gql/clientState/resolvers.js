import { SINGLE_EVENT } from "../queries";
export default {
  Mutation: {
    setSelectedEvent: (_, variables, { cache, getCacheKey }) => {
      const id = getCacheKey({ __typename: "Event", id: variables.id });
      console.log(id);
      const selectedEvent = cache.readFragment({ fragment: SINGLE_EVENT, id });
      cache.writeData({ data: { selectedEvent } });
      console.log(selectedEvent);

      return null;
    }
  }
};
