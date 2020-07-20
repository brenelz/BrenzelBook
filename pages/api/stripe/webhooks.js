import { buffer } from "micro";
import hasuraAdminRequest from "../../../utils/hasuraAdminRequest";
import gql from "graphql-tag";
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API);

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

const MUTATION_UPDATE_BOOKING = gql`
  mutation($id: Int!, $checkout_session_id: String!) {
    update_bookings_by_pk(
      pk_columns: { id: $id }
      _set: { paid: true, checkout_session_id: $checkout_session_id }
    ) {
      id
      datetime
      user {
        name
      }
      seller {
        name
        email
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

      const result = await hasuraAdminRequest(MUTATION_UPDATE_BOOKING, {
        id: session.client_reference_id,
        checkout_session_id: session.id,
      });

      const message = `A new booking has been made on BrenzelBook.<br /><br />${result.update_bookings_by_pk.user.name} at ${result.update_bookings_by_pk.datetime}`;

      try {
        const msg = {
          to: result.update_bookings_by_pk.seller.email,
          from: "brenelz@gmail.com",
          subject: `BrenzelBook Booking for ${result.update_bookings_by_pk.seller.name}`,
          text: message,
          html: message,
        };
        await sgMail.send(msg);
      } catch (error) {
        console.log(error);
      }
    }

    // Return a response to acknowledge receipt of the event
    res.json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};
