import { useQuery } from "urql";
import gql from "graphql-tag";
import Link from "next/link";

import StripeSellerSetup from "../components/StripeSellerSetup";

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

const IsSellerCell = ({ userId }) => {
  const [resIsSeller, _] = useQuery({
    query: QUERY_IS_SELLER,
    variables: {
      user_id: userId,
    },
  });

  if (resIsSeller.fetching) return <p>Loading...</p>;
  if (resIsSeller.error) return <p>Errored!</p>;

  const isSeller = resIsSeller.data?.users[0].seller_id !== null;

  return (
    <p className="mt-4">
      {isSeller ? (
        <StripeSellerSetup
          stripeUserId={resIsSeller.data?.users[0].seller?.stripe_user_id}
          email={resIsSeller.data?.users[0].seller?.email}
        />
      ) : (
        <Link href="/contact">
          <a
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:border-gray-700 focus:shadow-outline-gray active:bg-gray-700 transition ease-in-out duration-150"
            href="#"
          >
            Contact to become a seller
          </a>
        </Link>
      )}
    </p>
  );
};

export default IsSellerCell;
