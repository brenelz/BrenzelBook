import gql from "graphql-tag";

import hasuraAdminRequest from "../../../utils/hasuraAdminRequest";

export const QUERY_SELLER_BOOKINGS = gql`
  query($slug: String!) {
    sellers(where: { slug: { _eq: $slug } }) {
      bookings(where: { paid: { _eq: true } }) {
        datetime
        user {
          name
        }
      }
    }
  }
`;

export default async (req, res) => {
  const {
    query: { slug },
  } = req;

  const { sellers } = await hasuraAdminRequest(QUERY_SELLER_BOOKINGS, {
    slug,
  });

  const bookings = sellers[0].bookings.map((booking) => ({
    datetime: booking.datetime,
    user: booking.user.name,
  }));

  return res.status(200).json(bookings);
};
