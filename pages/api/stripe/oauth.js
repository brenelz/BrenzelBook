import hasuraRequest from "../../../lib/hasuraRequest";
import gql from "graphql-tag";

export default (req, res) => {
  const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

  const { code, state } = req.query;

  var error;

  // Send the authorization code to Stripe's API.
  stripe.oauth
    .token({
      grant_type: "authorization_code",
      code,
    })
    .then(
      (response) => {
        saveAccountId(response, state);

        res.writeHead(302, {
          Location: process.env.FRONTEND_ENDPOINT + "/admin",
        });
        res.end();
      },
      (err) => {
        if (err.type === "StripeInvalidGrantError") {
          return res
            .status(400)
            .json({ error: "Invalid authorization code: " + code });
        } else {
          return res.status(500).json({ error: "An unknown error occurred." });
        }
      }
    );
};

const saveAccountId = async (response, email) => {
  var id = response.stripe_user_id;
  const MUTATION_UPDATE_VENUE_STRIPE_USER_ID = gql`
    mutation($id: String!, $email: String!) {
      update_venues(
        _set: { stripe_user_id: $id }
        where: { email: { _eq: $email } }
      ) {
        affected_rows
      }
    }
  `;

  await hasuraRequest(MUTATION_UPDATE_VENUE_STRIPE_USER_ID, {
    id,
    email,
  });
};
