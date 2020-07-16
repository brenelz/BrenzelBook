import { createClient } from "urql";

const client = createClient({
  url: process.env.NEXT_PUBLIC_HASURA_ENDPOINT,
});

export default client;
