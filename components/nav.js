import Link from "next/link";
import { useFetchUser } from "../utils/user";

const Nav = () => {
  const { user } = useFetchUser();
  return (
    <ul>
      <li>
        <Link href="/">
          <a>Home</a>
        </Link>
      </li>
      <li>
        {user ? (
          <Link href="/dashboard">
            <a>Dashboard</a>
          </Link>
        ) : (
          <Link href="/api/login">
            <a>Login / Signup</a>
          </Link>
        )}
      </li>
      <li>
        <Link href="/sellers">
          <a>Sellers</a>
        </Link>
      </li>
    </ul>
  );
};

export default Nav;
