import gql from "graphql-tag";

import hasuraAdminRequest from "../../../utils/hasuraAdminRequest";

export default async (req, res) => {
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
      async (response) => {
        var id = response.stripe_user_id;
        await saveAccountId(id, state);

        res.writeHead(302, {
          Location: process.env.NEXT_PUBLIC_FRONTEND_ENDPOINT + "/dashboard",
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

const saveAccountId = async (id, email) => {
  const MUTATION_UPDATE_SELLER_STRIPE_USER_ID = gql`
    mutation($id: String!, $email: String!) {
      update_sellers(
        _set: { stripe_user_id: $id }
        where: { email: { _eq: $email } }
      ) {
        affected_rows
      }
    }
  `;

  await hasuraAdminRequest(MUTATION_UPDATE_SELLER_STRIPE_USER_ID, {
    id,
    email,
  });
};
