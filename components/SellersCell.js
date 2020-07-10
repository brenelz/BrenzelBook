import Link from "next/link";
import { useQuery } from "urql";
import gql from "graphql-tag";

export const QUERY_ALL_SELLERS = gql`
  query {
    sellers {
      id
      name
      email
      cost
      slug
    }
  }
`;

const SellersCell = () => {
  const [res, _] = useQuery({
    query: QUERY_ALL_SELLERS,
  });

  if (res.fetching) return <p>Loading...</p>;
  if (res.error) return <p>Errored!</p>;

  return (
    <ul>
      {res.data.sellers.map((seller) => (
        <li key={seller.id}>
          <Link href="/sellers/[slug]" as={`/sellers/${seller.slug}`}>
            {seller.name}
          </Link>{" "}
          - ${(seller.cost / 100).toFixed(2)}
        </li>
      ))}
    </ul>
  );
};

export default SellersCell;
