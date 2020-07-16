import hasuraAdminRequest from "../../../utils/hasuraAdminRequest";
import gql from "graphql-tag";

export const QUERY_BOOKING_BY_ID = gql`
  query($id: Int!) {
    bookings(where: { id: { _eq: $id } }) {
      seller {
        name
        cost
      }
    }
  }
`;

export default async (req, res) => {
  const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
  const json = JSON.parse(req.body);
  const booking_id = json.booking_id;

  const { bookings } = await hasuraAdminRequest(QUERY_BOOKING_BY_ID, {
    id: booking_id,
  });

  const booking = bookings[0];

  (async () => {
    const session = await stripe.checkout.sessions.create(
      {
        payment_method_types: ["card"],
        line_items: [
          {
            name: booking.seller.name,
            amount: booking.seller.cost,
            currency: "cad",
            quantity: 1,
          },
        ],
        payment_intent_data: {
          application_fee_amount: booking.seller.cost / 100,
        },
        success_url: process.env.FRONTEND_ENDPOINT + "/bookings/success",
        cancel_url: process.env.FRONTEND_ENDPOINT + "/bookings/cancel",
      },
      {
        stripeAccount: "",
      }
    );

    return res.status(200).json({ session });
  })();
};
