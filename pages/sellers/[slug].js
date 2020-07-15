import { useRouter } from "next/router";
import Link from "next/link";
import SellerBookingsCell from "../../components/SellerBookingsCell";
import MakeBookingForm from "../../components/MakeBookingForm";
import { useFetchUser } from "../../utils/user";

const Sellers = () => {
  const router = useRouter();
  const { user, loading } = useFetchUser();

  const { slug } = router.query;
  return (
    <div>
      <h1>Sellers</h1>
      <h2>Bookings</h2>
      <SellerBookingsCell slug={slug} />
      <h3>Make a booking</h3>
      {!user ? (
        <p>
          <Link href="/api/login">
            <a>Please Login / Signup</a>
          </Link>
        </p>
      ) : (
        <MakeBookingForm slug={slug} />
      )}
    </div>
  );
};

export default Sellers;
