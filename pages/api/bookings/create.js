import gql from "graphql-tag";
import client from "../../../utils/graphql-client";
import { createRequest } from "urql";

client.fetchOptions = () => {
  return {
    headers: { "X-Hasura-Admin-Secret": process.env.HASURA_SECRET },
  };
};

const MUTATION_INSERT_BOOKING = gql`
  mutation(
    $cost: Int!
    $datetime: timestamptz!
    $user_id: Int!
    $venue_id: Int!
    $checkout_session_id: String!
  ) {
    insert_bookings(
      objects: {
        cost: $cost
        datetime: $datetime
        user_id: $user_id
        venue_id: $venue_id
        checkout_session_id: $checkout_session_id
      }
    ) {
      affected_rows
    }
  }
`;

export default async (req, res) => {
  const json = JSON.parse(req.body);

  return res.status(200).json({ success: true });
};
