import Link from "next/link";
import { useFetchUser } from "../../utils/user";
import UserBookingsCell from "../../components/UserBookingsCell";
import SellerBookingsCell from "../../components/SellerBookingsCell";

import { useQuery } from "urql";
import gql from "graphql-tag";

export const QUERY_ARE_SELLER = gql`
  query($id: String!) {
    users(where: { id: { _eq: $id } }) {
      sellers {
        slug
      }
    }
  }
`;

const Dashboard = () => {
  const { user, loading } = useFetchUser();
  const [res, _] = useQuery({
    query: QUERY_ARE_SELLER,
    variables: {
      id: "auth0|5f05259ca15b7b001361ef1d",
    },
  });

  const slug = res.data?.users[0].sellers.slug;

  return (
    <div>
      <h1>Dashboard</h1>
      {!user ? (
        <p>Please login</p>
      ) : (
        <div>
          <p>
            <Link href="/api/logout">
              <a>Logout</a>
            </Link>
          </p>
          <h2>Your Bookings</h2>
          {slug !== null ? (
            <SellerBookingsCell slug={"rosenort-arena"} />
          ) : (
            <UserBookingsCell />
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
