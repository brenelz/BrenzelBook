import hasuraAdminRequest from "../../../utils/hasuraAdminRequest";
import gql from "graphql-tag";

export const QUERY_BOOKING_BY_ID = gql`
  query($id: Int!) {
    bookings(where: { id: { _eq: $id } }) {
      seller {
        slug
        name
        cost
        stripe_user_id
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
        customer_email: json.customer_email,
        client_reference_id: booking_id,
        payment_intent_data: {
          application_fee_amount: booking.seller.cost * 0.01,
        },
        success_url:
          process.env.NEXT_PUBLIC_FRONTEND_ENDPOINT +
          "/sellers/" +
          booking.seller.slug,
        cancel_url:
          process.env.NEXT_PUBLIC_FRONTEND_ENDPOINT +
          "/sellers/" +
          booking.seller.slug,
      },
      {
        stripeAccount: booking.seller.stripe_user_id,
      }
    );

    return res.status(200).json({ session });
  })();
};
