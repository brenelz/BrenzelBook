import Link from "next/link";
import { useQuery } from "urql";
import gql from "graphql-tag";

export const QUERY_USER_BOOKINGS = gql`
  query {
    bookings {
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

const UserBookingsCell = () => {
  const [res, _] = useQuery({
    query: QUERY_USER_BOOKINGS,
  });

  if (res.fetching) return <p>Loading...</p>;
  if (res.error) return <p>Errored!</p>;

  return (
    <ul>
      {res.data.bookings.map((booking) => (
        <li key={booking.id}>
          <Link href="/sellers/[slug]" as={`/sellers/${booking.seller.slug}`}>
            <a>
              {booking.seller.name} - ${(booking.cost / 100).toFixed(2)} -{" "}
              {booking.datetime}
            </a>
          </Link>{" "}
        </li>
      ))}
    </ul>
  );
};

export default UserBookingsCell;
