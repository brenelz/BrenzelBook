import hasuraRequest from "../../../lib/hasuraRequest";
import gql from "graphql-tag";

export const QUERY_VENUE_BY_SLUG = gql`
  query($slug: String!) {
    venues(where: { slug: { _eq: $slug } }) {
      id
      slug
      name
      cost
      stripe_user_id
    }
  }
`;

export default async (req, res) => {
  const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
  const json = JSON.parse(req.body);
  const slug = json.slug;

  const { venues } = await hasuraRequest(QUERY_VENUE_BY_SLUG, {
    slug,
  });
  const venue = venues[0];

  (async () => {
    const session = await stripe.checkout.sessions.create(
      {
        payment_method_types: ["card"],
        line_items: [
          {
            name: venue.name,
            amount: venue.cost,
            currency: "cad",
            quantity: 1,
          },
        ],
        metadata: {
          venue_id: venue.id,
          datetime: json.datetime,
        },
        payment_intent_data: {
          application_fee_amount: venue.cost / 100,
        },
        success_url: process.env.FRONTEND_ENDPOINT + "/bookings/success",
        cancel_url: process.env.FRONTEND_ENDPOINT + "/bookings/cancel",
      },
      {
        stripeAccount: venue.stripe_user_id,
      }
    );

    return res.status(200).json({ session });
  })();
};
