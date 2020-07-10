import Link from "next/link";
import { useQuery } from "urql";
import gql from "graphql-tag";

export const QUERY_SELLER_BOOKINGS = gql`
  query($slug: String!) {
    sellers(where: { slug: { _eq: $slug } }) {
      id
      name
      slug
      bookings {
        id
        cost
        datetime
      }
    }
  }
`;

const SellerBookingsCell = ({ slug }) => {
  const [res, _] = useQuery({
    query: QUERY_SELLER_BOOKINGS,
    variables: {
      slug,
    },
  });

  if (res.fetching) return <p>Loading...</p>;
  if (res.error) return <p>Errored!</p>;

  const seller = res.data.sellers[0];

  return (
    <ul>
      {seller.bookings?.map((booking) => (
        <li key={seller.bookings.id}>
          <Link href="/sellers/[slug]" as={`/sellers/${seller.slug}`}>
            <a>
              {seller.name} - ${(booking.cost / 100).toFixed(2)} -{" "}
              {booking.datetime}
            </a>
          </Link>{" "}
        </li>
      ))}
    </ul>
  );
};

export default SellerBookingsCell;
