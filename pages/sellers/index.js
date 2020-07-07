import { useQuery } from "urql";
import gql from "graphql-tag";
import Link from "next/link";

import Nav from "../../components/nav";

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

const Sellers = () => {
  const [res, _] = useQuery({
    query: QUERY_ALL_SELLERS,
  });
  if (res.fetching) return <p>Loading...</p>;
  if (res.error) return <p>Errored!</p>;

  return (
    <div>
      <Nav />
      <h1>Sellers</h1>
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
    </div>
  );
};

export default Sellers;
