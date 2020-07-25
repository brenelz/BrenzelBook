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

const UserBookingsCell = ({ userId }) => {
  const [res, _] = useQuery({
    query: QUERY_USER_BOOKINGS,
    variables: {
      user_id: userId,
    },
  });

  if (res.fetching) return <p>Loading...</p>;
  if (res.error) return <p>Errored!</p>;

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
    </div>
  );
};

export default UserBookingsCell;
