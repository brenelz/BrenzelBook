import { useRouter } from "next/router";
import Link from "next/link";
import SellerBookingsCell from "../../components/SellerBookingsCell";
import MakeBookingForm from "../../components/MakeBookingForm";
import { useFetchUser } from "../../utils/user";
import gql from "graphql-tag";
import { useQuery } from "urql";

export const QUERY_SELLER_DETAILS = gql`
  query($slug: String!) {
    sellers(where: { slug: { _eq: $slug } }) {
      stripe_user_id
    }
  }
`;

const Sellers = () => {
  const router = useRouter();
  const { slug } = router.query;

  const { user, loading } = useFetchUser();
  const [res, _] = useQuery({
    query: QUERY_SELLER_DETAILS,
    variables: {
      slug,
    },
  });

  return (
    <div>
      <h1>Sellers</h1>
      <h2>Bookings</h2>
      <SellerBookingsCell slug={slug} />
      <h3>Make a booking</h3>
      {!user ? (
        <p>
          <Link href="/api/login">
            <a>Please Login / Signup</a>
          </Link>
        </p>
      ) : (
        <MakeBookingForm
          slug={slug}
          user={user}
          stripeUserId={res.data?.sellers[0].stripe_user_id}
        />
      )}
    </div>
  );
};

export default Sellers;
