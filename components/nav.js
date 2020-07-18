import Link from "next/link";
import { useUser } from "../utils/user";

const Nav = () => {
  const { user } = useUser();
  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center mx-auto">
            <div className="flex-shrink-0">
              <h2 className="text-sm tracking-tight leading-10 font-extrabold text-white">
                <Link href="/">
                  <a>BrenzelBook</a>
                </Link>
              </h2>
            </div>
            <div className="block">
              <div className="ml-10 flex items-baseline">
                {user ? (
                  <Link href="/dashboard">
                    <a
                      href="#"
                      className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 focus:outline-none focus:text-white focus:outline-none focus:text-white focus:bg-gray-700"
                    >
                      Dashboard
                    </a>
                  </Link>
                ) : (
                  <Link href="/api/login">
                    <a
                      href="#"
                      className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 focus:outline-none focus:text-white focus:outline-none focus:text-white focus:bg-gray-700"
                    >
                      Login / Signup
                    </a>
                  </Link>
                )}

                <Link href="/sellers">
                  <a className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700">
                    Sellers
                  </a>
                </Link>
                <Link href="/contact">
                  <a className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700">
                    Contact
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
