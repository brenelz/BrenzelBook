import SellersCell from "../../components/SellersCell";
import { print } from "graphql/language/printer";

const Sellers = () => {
  return (
    <div className="bg-white py-8 px-4 overflow-hidden">
      <div className="relative max-w-xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10">
            Sellers
          </h2>
          <p>
            <span className="text-gray-500 text-sm">
              click on a seller to make or view its bookings.
            </span>
          </p>
        </div>
        <div className="mt-4">
          <SellersCell />
        </div>
      </div>
    </div>
  );
};

export default Sellers;
