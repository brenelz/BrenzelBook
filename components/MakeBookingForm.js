import { useState, useEffect } from "react";

const MakeBookingForm = ({ slug, user }) => {
  const [month, setMonth] = useState("01");
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
        }),
      });
      const checkout = await result.json();

      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_API_KEY, {
        stripeAccount: "test123",
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
      >
        <option value="01">January</option>
        <option value="02">February</option>
        <option value="03">March</option>
        <option value="04">April</option>
        <option value="05">May</option>
        <option value="06">June</option>
        <option value="07">July</option>
        <option value="08">August</option>
        <option value="09">September</option>
        <option value="10">September</option>
        <option value="11">November</option>
        <option value="12">December</option>
      </select>

      <select name="day" id="day" onChange={(e) => setDay(e.target.value)}>
        {dayoptions}
      </select>

      <select name="year" id="year" onChange={(e) => setYear(e.target.value)}>
        <option value="2020">2020</option>
        <option value="2021">2021</option>
        <option value="2022">2022</option>
      </select>

      <p>
        <select name="time" id="time" onChange={(e) => setTime(e.target.value)}>
          {timeoptions}
        </select>
      </p>

      {error ? <p>{error}</p> : null}

      <button type="submit" disabled={disabled}>
        Book
      </button>
    </form>
  );
};

export default MakeBookingForm;
