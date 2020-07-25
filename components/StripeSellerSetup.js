const StripeSellerSetup = ({ stripeUserId, email }) => {
  return stripeUserId ? (
    <div className="bg-green-100 p-2">
      Congrats you are ready to receive payments!
    </div>
  ) : (
    <div>
      <p className="bg-yellow-100 p-2">
        You must connect with stripe to receive payments.
      </p>
      <a
        className="mt-4 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:border-gray-700 focus:shadow-outline-gray active:bg-gray-700 transition ease-in-out duration-150"
        href={`https://connect.stripe.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_STRIPE_CLIENT_ID}&state=${email}&scope=read_write&response_type=code&stripe_user[email]=${email}`}
      >
        <span>Connect with Stripe</span>
      </a>
    </div>
  );
};

export default StripeSellerSetup;
