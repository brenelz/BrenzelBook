import { GraphQLClient } from "graphql-request";
import { print } from "graphql/language/printer";

export default function hasuraRequest(query, variables) {
  const endpoint = process.env.NEXT_PUBLIC_HASURA_ENDPOINT;

  const client = new GraphQLClient(endpoint, {
    headers: {
      "x-hasura-admin-secret": process.env.HASURA_GRAPHQL_ADMIN_SECRET,
    },
  });

  return client.request(print(query), variables);
}
