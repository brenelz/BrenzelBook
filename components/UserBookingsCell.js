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
      user {
        name
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
    <div className="bg-green-100 p-2">
      Congrats you are ready to receive payments!
    </div>
  ) : (
    <div>
      <p className="bg-yellow-100 p-2">
        You must connect with stripe to receive payments.
      </p>
      <a
        className="mt-4 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:border-gray-700 focus:shadow-outline-gray active:bg-gray-700 transition ease-in-out duration-150"
        href={`https://connect.stripe.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_STRIPE_CLIENT_ID}&state=${resIsSeller.data?.users[0].seller?.email}&scope=read_write&response_type=code&stripe_user[email]=${resIsSeller.data?.users[0].seller?.email}`}
      >
        <span>Connect with Stripe</span>
      </a>
    </div>
  );

  function appendLeadingZeroes(n) {
    if (n <= 9) {
      return "0" + n;
    }
    return n;
  }

  return (
    <div>
      <ul>
        {res.data.bookings.length > 0 ? (
          res.data.bookings.map((booking) => {
            const dt = new Date(booking.datetime);
            const formattedDt =
              dt.getFullYear() +
              "-" +
              appendLeadingZeroes(dt.getMonth() + 1) +
              "-" +
              appendLeadingZeroes(dt.getDate()) +
              " " +
              appendLeadingZeroes(dt.getHours()) +
              ":" +
              appendLeadingZeroes(dt.getMinutes()) +
              ":" +
              appendLeadingZeroes(dt.getSeconds());
            return (
              <li key={booking.id}>
                <a class="block hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition duration-150 ease-in-out">
                  <div class="py-4">
                    <div class="flex items-center justify-between">
                      <div class="text-sm leading-5 font-medium text-indigo-600 truncate">
                        <span class="text-gray-600">{booking.user.name}</span>
                      </div>
                      <div class="ml-2 flex-shrink-0 flex">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Hourly
                        </span>
                      </div>
                    </div>
                    <div class="mt-2 sm:flex sm:justify-between">
                      <div class="sm:flex">
                        <div class="mr-6 flex items-center text-sm leading-5 text-gray-500">
                          {formattedDt}
                        </div>
                        <div class="mt-2 flex items-center text-sm leading-5 text-gray-500 sm:mt-0"></div>
                      </div>
                      <div class="mt-2 flex items-center text-sm leading-5 text-gray-500 sm:mt-0"></div>
                    </div>
                  </div>
                </a>
              </li>
            );
          })
        ) : (
          <p>No Bookings for your user is found.</p>
        )}
      </ul>
      <p className="mt-4">
        {isSeller ? (
          stripeDiv
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
    </div>
  );
};

export default UserBookingsCell;
