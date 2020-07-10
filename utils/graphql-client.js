import { createClient } from "urql";

const client = createClient({
  url: "https://brenzelbook.herokuapp.com/v1/graphql",
});

export default client;
