import Link from "next/link";

const Nav = () => {
  return (
    <ul>
      <li>
        <Link href="/">
          <a>Home</a>
        </Link>
      </li>
      <li>
        <Link href="/api/login">
          <a>Login / Signup</a>
        </Link>
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
