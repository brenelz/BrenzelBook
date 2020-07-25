import Link from "next/link";

const SellersList = ({ sellers }) => {
  return (
    <>
      {sellers.length > 0 ? (
        <ul>
          {sellers.map((seller) => (
            <li key={seller.id}>
              <Link href="/sellers/[slug]" as={`/sellers/${seller.slug}`}>
                <a className="block hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition duration-150 ease-in-out">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="text-sm leading-5 font-medium text-indigo-600 truncate">
                        {seller.name}
                        {seller.email_visible ? (
                          <span className="text-gray-600">
                            {" "}
                            - {seller.email}
                          </span>
                        ) : null}
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Hourly
                        </span>
                      </div>
                    </div>
                    {seller.description != null ? (
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <div className="mr-6 flex items-center text-sm leading-5 text-gray-500">
                            {seller.description}
                          </div>
                          <div className="mt-2 flex items-center text-sm leading-5 text-gray-500 sm:mt-0"></div>
                        </div>
                        <div className="mt-2 flex items-center text-sm leading-5 text-gray-500 sm:mt-0"></div>
                      </div>
                    ) : null}
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <div className="mr-6 flex items-center text-sm leading-5 text-gray-500">
                          ${seller.cost / 100} / hr
                        </div>
                        <div className="mt-2 flex items-center text-sm leading-5 text-gray-500 sm:mt-0"></div>
                      </div>
                      <div className="mt-2 flex items-center text-sm leading-5 text-gray-500 sm:mt-0"></div>
                    </div>
                  </div>
                </a>
              </Link>{" "}
            </li>
          ))}{" "}
        </ul>
      ) : (
        <p className="m-4">No sellers found</p>
      )}
    </>
  );
};

export default SellersList;
