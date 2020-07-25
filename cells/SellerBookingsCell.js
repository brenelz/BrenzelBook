import Link from "next/link";
import { useQuery } from "urql";
import gql from "graphql-tag";

export const QUERY_SELLER_BOOKINGS = gql`
  query($slug: String!) {
    sellers(where: { slug: { _eq: $slug } }) {
      id
      name
      slug
      bookings(where: { paid: { _eq: true } }) {
        id
        datetime
        user {
          name
        }
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

  function appendLeadingZeroes(n) {
    if (n <= 9) {
      return "0" + n;
    }
    return n;
  }

  return (
    <>
      {seller.bookings.length > 0 ? (
        <ul>
          {seller.bookings?.map((booking) => {
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
                <a className="block hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition duration-150 ease-in-out">
                  <div className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm leading-5 font-medium text-indigo-600 truncate">
                        <span className="text-gray-600">
                          {booking.user?.name}
                        </span>
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
                          {formattedDt}
                        </div>
                        <div className="mt-2 flex items-center text-sm leading-5 text-gray-500 sm:mt-0"></div>
                      </div>
                      <div className="mt-2 flex items-center text-sm leading-5 text-gray-500 sm:mt-0"></div>
                    </div>
                  </div>
                </a>
              </li>
            );
          })}
        </ul>
      ) : (
        <p>No bookings for this seller could be found.</p>
      )}
    </>
  );
};

export default SellerBookingsCell;
