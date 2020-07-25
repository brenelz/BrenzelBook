import Head from "next/head";
import gql from "graphql-tag";

import hasuraAdminRequest from "../../utils/hasuraAdminRequest";
import SellersList from "../../components/SellersList";

export const QUERY_ALL_SELLERS = gql`
  query {
    sellers {
      id
      name
      email
      cost
      slug
      description
      email_visible
    }
  }
`;

export async function getStaticProps() {
  const { sellers } = await hasuraAdminRequest(QUERY_ALL_SELLERS);

  return {
    props: {
      sellers,
    },
  };
}

const Sellers = ({ sellers }) => {
  return (
    <>
      <Head>
        <title>Sellers | BrenzelBook</title>
      </Head>
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
            {/* <SellersCell /> */}
            <SellersList sellers={sellers} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Sellers;
