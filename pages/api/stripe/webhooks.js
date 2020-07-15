import { buffer } from "micro";
import hasuraRequest from "../../../lib/hasuraRequest";
import gql from "graphql-tag";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

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

const QUERY_VENUE_COST = gql`
  query {
    venues {
      cost
    }
  }
`;

const MUTATION_INSERT_USER = gql`
  mutation($email: String, $name: String, $stripe_customer_id: String!) {
    insert_users(
      objects: {
        email: $email
        name: $name
        stripe_customer_id: $stripe_customer_id
      }
    ) {
      affected_rows
      returning {
        id
      }
    }
  }
`;

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req, res) => {
  if (req.method === "POST") {
    const sig = req.headers["stripe-signature"];
    const buf = await buffer(req);

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        buf.toString(),
        sig,
        endpointSecret
      );
    } catch (err) {
      console.log(err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      stripe.customers.retrieve(session.customer, async function (
        err,
        customer
      ) {
        const userResult = await hasuraRequest(MUTATION_INSERT_USER, {
          name: customer.name,
          email: customer.email,
          stripe_customer_id: session.customer,
        });

        const result = await hasuraRequest(MUTATION_INSERT_BOOKING, {
          cost: session.display_items[0].amount,
          datetime: session.metadata.datetime
            ? session.metadata.datetime
            : new Date(),
          user_id: userResult.insert_users.returning[0].id,
          venue_id: session.metadata.venue_id ? session.metadata.venue_id : 24,
          checkout_session_id: session.id,
        });
      });
    }

    // Return a response to acknowledge receipt of the event
    res.json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};
