import Nav from "../../components/nav";
import { useRouter } from "next/router";

const Sellers = () => {
  const router = useRouter();
  const { slug } = router.query;
  return (
    <div>
      <Nav />
      <h1>Sellers</h1>
      <h2>{slug}</h2>
      <h3>Make a booking</h3>
    </div>
  );
};

export default Sellers;
