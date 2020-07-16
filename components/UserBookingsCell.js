import Link from "next/link";
import { useQuery } from "urql";
import gql from "graphql-tag";

export const QUERY_USER_BOOKINGS = gql`
  query($user_id: String!) {
    bookings(where: { user_id: { _eq: $user_id }, paid: { _eq: true } }) {
      id
      cost
      datetime
      seller {
        id
        name
        slug
      }
    }
  }
`;

export const QUERY_IS_SELLER = gql`
  query($user_id: String!) {
    users(where: { id: { _eq: $user_id } }) {
      seller_id
      seller {
        email
        stripe_user_id
      }
    }
  }
`;

const UserBookingsCell = ({ userId, email }) => {
  const [res, _] = useQuery({
    query: QUERY_USER_BOOKINGS,
    variables: {
      user_id: userId,
    },
  });

  const [resIsSeller, _2] = useQuery({
    query: QUERY_IS_SELLER,
    variables: {
      user_id: userId,
    },
  });

  const isSeller = resIsSeller.data?.users[0].seller_id !== null;

  if (res.fetching) return <p>Loading...</p>;
  if (res.error) return <p>Errored!</p>;

  const stripeDiv = resIsSeller.data?.users[0].seller?.stripe_user_id ? (
    <span>Connected with Stripe!</span>
  ) : (
    <a
      href={`https://connect.stripe.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_STRIPE_CLIENT_ID}&state=${resIsSeller.data?.users[0].seller?.email}&scope=read_write&response_type=code&stripe_user[email]=${resIsSeller.data?.users[0].seller?.email}`}
    >
      <span>Connect with Stripe</span>
    </a>
  );

  return (
    <div>
      <ul>
        {res.data.bookings.length > 0 ? (
          res.data.bookings.map((booking) => (
            <li key={booking.id}>
              <Link
                href="/sellers/[slug]"
                as={`/sellers/${booking.seller.slug}`}
              >
                <a>
                  {booking.seller.name} - ${(booking.cost / 100).toFixed(2)} -{" "}
                  {booking.datetime}
                </a>
              </Link>{" "}
            </li>
          ))
        ) : (
          <p>No Bookings found</p>
        )}
      </ul>
      <p>
        {isSeller ? (
          stripeDiv
        ) : (
          <Link href="/contact">Contact to become a seller</Link>
        )}
      </p>
    </div>
  );
};

export default UserBookingsCell;
