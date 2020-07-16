import Link from "next/link";
import { useFetchUser } from "../../utils/user";
import UserBookingsCell from "../../components/UserBookingsCell";
import SellerBookingsCell from "../../components/SellerBookingsCell";

import { useQuery } from "urql";

const Dashboard = () => {
  const { user, loading } = useFetchUser();

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
          <UserBookingsCell userId={user.user.sub} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
