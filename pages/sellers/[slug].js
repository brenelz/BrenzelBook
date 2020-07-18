import { useRouter } from "next/router";
import Link from "next/link";
import SellerBookingsCell from "../../components/SellerBookingsCell";
import MakeBookingForm from "../../components/MakeBookingForm";
import { useUser } from "../../utils/user";
import gql from "graphql-tag";
import { useQuery } from "urql";

export const QUERY_SELLER_DETAILS = gql`
  query($slug: String!) {
    sellers(where: { slug: { _eq: $slug } }) {
      id
      name
      email
      cost
      stripe_user_id
    }
  }
`;

const Sellers = () => {
  const router = useRouter();
  const { slug } = router.query;

  const { user, loading } = useUser();
  const [res, _] = useQuery({
    query: QUERY_SELLER_DETAILS,
    variables: {
      slug,
    },
  });

  const seller = res.data?.sellers[0];
  if (!seller) {
    return null;
  }

  return (
    <div className="bg-white py-8 px-4 overflow-hidden">
      <div className="relative max-w-xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10">
            {seller.name}
          </h2>
        </div>
        <div className="mt-4">
          <ul>
            <li key={seller.id}>
              <a className="block hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition duration-150 ease-in-out">
                <div className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm leading-5 font-medium text-indigo-600 truncate">
                      <span className="text-gray-600">{seller.email}</span>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Hourly
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <div className="mr-6 flex items-center text-sm leading-5 text-gray-500">
                        ${seller.cost / 100} / hr
                      </div>
                      <div className="mt-2 flex items-center text-sm leading-5 text-gray-500 sm:mt-0"></div>
                    </div>
                    <div className="mt-2 flex items-center text-sm leading-5 text-gray-500 sm:mt-0"></div>
                  </div>
                </div>
              </a>
            </li>
          </ul>
          <h2 className="text-md leading-9 font-extrabold tracking-tight text-gray-900">
            Make a Booking
          </h2>
          {!user ? (
            <p>
              <Link href="/api/login">
                <a className="mt-4 inline-flex items-center justify-center px-3 py-1 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:border-gray-700 focus:shadow-outline-gray active:bg-gray-700 transition ease-in-out duration-150">
                  Please Login / Signup
                </a>
              </Link>
            </p>
          ) : (
            <MakeBookingForm
              slug={slug}
              user={user}
              stripeUserId={res.data?.sellers[0].stripe_user_id}
            />
          )}
          <h2 className="mt-6 text-md leading-9 font-extrabold tracking-tight text-gray-900">
            Bookings
          </h2>
          <SellerBookingsCell slug={slug} />
        </div>
      </div>
    </div>
  );
};

export default Sellers;
