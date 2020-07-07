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
        <Link href="/login">
          <a>Login</a>
        </Link>
      </li>
      <li>
        <Link href="/signup">
          <a>Signup</a>
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
