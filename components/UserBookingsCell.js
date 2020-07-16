import Link from "next/link";
import { useQuery } from "urql";
import gql from "graphql-tag";

export const QUERY_USER_BOOKINGS = gql`
  query($user_id: String!) {
    bookings(where: { user_id: { _eq: $user_id } }) {
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

const UserBookingsCell = ({ userId }) => {
  const [res, _] = useQuery({
    query: QUERY_USER_BOOKINGS,
    variables: {
      user_id: userId,
    },
  });

  if (res.fetching) return <p>Loading...</p>;
  if (res.error) return <p>Errored!</p>;

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
        <Link href="/contact">Contact to become a seller</Link>
      </p>
    </div>
  );
};

export default UserBookingsCell;
