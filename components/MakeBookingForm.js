import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";

const MakeBookingForm = ({ slug, user, stripeUserId }) => {
  if (stripeUserId == null) {
    return (
      <p className="bg-red-100 p-2">Unable to make a booking at this time.</p>
    );
  }
  const [month, setMonth] = useState("07");
  const [day, setDay] = useState("01");
  const [year, setYear] = useState("2020");
  const [time, setTime] = useState("0:00");
  const [disabled, setDisabled] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setDisabled(true);
    const response = await fetch("/api/bookings/create", {
      method: "POST",
      body: JSON.stringify({
        datetime: `${year}-${month}-${day} ${time}`,
        slug: slug,
        userId: user.user.sub,
      }),
    });

    const json = await response.json();

    setDisabled(false);
    if (json.success == false) {
      setError(json.message);
    } else {
      const result = await fetch(`/api/stripe/checkout`, {
        method: "post",
        body: JSON.stringify({
          booking_id: json.booking_id,
          customer_email: user.user.name,
        }),
      });
      const checkout = await result.json();

      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_API_KEY, {
        stripeAccount: stripeUserId,
      });

      const { error } = await stripe.redirectToCheckout({
        sessionId: checkout.session.id,
      });

      if (error) {
        console.error(error);
      }
    }
  };

  let timeoptions = [];
  for (let i = 0; i < 24; i++) {
    timeoptions.push(<option>{i}:00</option>);
  }

  let dayoptions = [];
  for (let i = 1; i <= 31; i++) {
    dayoptions.push(<option>{i}</option>);
  }

  return (
    <form onSubmit={handleSubmit}>
      <select
        name="month"
        id="month"
        onChange={(e) => setMonth(e.target.value)}
        class="mt-1 form-select mr-2 pl-3 pr-10 py-2 text-base leading-6 border-gray-300 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
      >
        <option value="01">January</option>
        <option value="02">February</option>
        <option value="03">March</option>
        <option value="04">April</option>
        <option value="05">May</option>
        <option value="06">June</option>
        <option value="07" selected>
          July
        </option>
        <option value="08">August</option>
        <option value="09">September</option>
        <option value="10">September</option>
        <option value="11">November</option>
        <option value="12">December</option>
      </select>

      <select
        name="day"
        id="day"
        onChange={(e) => setDay(e.target.value)}
        class="mt-1 form-select mr-2 pl-3 pr-10 py-2 text-base leading-6 border-gray-300 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
      >
        {dayoptions}
      </select>

      <select
        name="year"
        id="year"
        onChange={(e) => setYear(e.target.value)}
        class="mt-1 form-select mr-2 pl-3 pr-10 py-2 text-base leading-6 border-gray-300 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
      >
        <option value="2020">2020</option>
        <option value="2021">2021</option>
        <option value="2022">2022</option>
      </select>

      <select
        name="time"
        id="time"
        onChange={(e) => setTime(e.target.value)}
        class="mt-1 form-select mr-2 pl-3 pr-10 py-2 text-base leading-6 border-gray-300 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
      >
        {timeoptions}
      </select>

      <p>
        {error ? <p className="mt-2 bg-red-100 p-2">{error}</p> : null}

        <button
          className="mt-4 inline-flex items-center justify-center px-3 py-1 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:border-gray-700 focus:shadow-outline-gray active:bg-gray-700 transition ease-in-out duration-150"
          type="submit"
          disabled={disabled}
        >
          Book
        </button>
      </p>
    </form>
  );
};

export default MakeBookingForm;
