import gql from "graphql-tag";
import hasuraAdminRequest from "../../../utils/hasuraAdminRequest";

const MUTATION_INSERT_BOOKING = gql`
  mutation(
    $cost: Int!
    $datetime: timestamptz!
    $seller_id: Int!
    $user_id: String!
  ) {
    insert_bookings(
      objects: {
        cost: $cost
        datetime: $datetime
        seller_id: $seller_id
        user_id: $user_id
      }
    ) {
      affected_rows
      returning {
        id
      }
    }
  }
`;

const QUERY_GET_SELLER_BY_SLUG = gql`
  query($slug: String!) {
    sellers(where: { slug: { _eq: $slug } }) {
      id
      cost
      valid_booking_endpoint
    }
  }
`;

const QUERY_ALREADY_BOOKED = gql`
  query($seller_id: Int!, $datetime: timestamptz!) {
    bookings(
      where: {
        seller_id: { _eq: $seller_id }
        paid: { _eq: true }
        datetime: { _eq: $datetime }
      }
    ) {
      datetime
    }
  }
`;

export default async (req, res) => {
  const json = JSON.parse(req.body);
  const datetime = json.datetime + "-05:00";

  const { sellers } = await hasuraAdminRequest(QUERY_GET_SELLER_BY_SLUG, {
    slug: json.slug,
  });

  const alreadyBooked = await hasuraAdminRequest(QUERY_ALREADY_BOOKED, {
    seller_id: sellers[0].id,
    datetime: datetime,
  });

  if (alreadyBooked.bookings.length > 0) {
    return res
      .status(200)
      .json({ success: false, message: "Already booked. Please try again." });
  }

  if (sellers[0].valid_booking_endpoint != null) {
    try {
      const validBookingResult = await fetch(
        sellers[0].valid_booking_endpoint + `?datetime=${datetime}`
      );
      const validBookingJson = await validBookingResult.json();
      if (validBookingJson.valid_booking === false) {
        return res.status(200).json({
          success: false,
          message: "Already booked. Please try again.",
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  const result = await hasuraAdminRequest(MUTATION_INSERT_BOOKING, {
    cost: sellers[0].cost,
    datetime: datetime,
    seller_id: sellers[0].id,
    user_id: json.userId,
  });

  return res.status(200).json({
    success: true,
    booking_id: result.insert_bookings.returning[0].id,
  });
};
