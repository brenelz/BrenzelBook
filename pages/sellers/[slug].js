import { useRouter } from "next/router";
import SellerBookingsCell from "../../components/SellerBookingsCell";

const Sellers = () => {
  const router = useRouter();
  const { slug } = router.query;
  return (
    <div>
      <h1>Sellers</h1>
      <h2>Bookings</h2>
      <SellerBookingsCell slug={slug} />
      <h3>Make a booking</h3>
    </div>
  );
};

export default Sellers;
