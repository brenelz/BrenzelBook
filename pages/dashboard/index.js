import Link from "next/link";
import Head from "next/head";

import { useUser } from "../../utils/user";
import UserBookingsCell from "../../cells/UserBookingsCell";
import IsSellerCell from "../../cells/IsSellerCell";

const Dashboard = () => {
  const { user } = useUser();

  if (!user) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Dashboard | BrenzelBook</title>
      </Head>
      <div className="bg-white py-8 px-4 overflow-hidden">
        <div className="relative max-w-xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10">
              Dashboard
            </h2>
            {user && (
              <p>
                <Link href="/api/logout">
                  <a className="text-gray-500 text-sm">
                    Logout ({user.user.name})
                  </a>
                </Link>
              </p>
            )}
          </div>
          <div className="mt-4">
            {!user ? (
              <p className="text-center">
                <Link href="/api/login">
                  <a
                    className="mt-4 inline-flex items-center justify-center px-3 py-2 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:border-gray-700 focus:shadow-outline-gray active:bg-gray-700 transition ease-in-out duration-150"
                    href="#"
                  >
                    Please Login / Signup
                  </a>
                </Link>
              </p>
            ) : (
              <div>
                <h2 className="text-md leading-9 font-extrabold tracking-tight text-gray-900">
                  Your Bookings
                </h2>
                <UserBookingsCell userId={user.user.sub} />
                <IsSellerCell userId={user.user.sub} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
