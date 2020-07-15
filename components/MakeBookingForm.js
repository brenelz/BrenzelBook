import { useState } from "react";

const MakeBookingForm = ({ slug }) => {
  const [month, setMonth] = useState("01");
  const [day, setDay] = useState("01");
  const [year, setYear] = useState("2020");
  const [time, setTime] = useState("0:00");
  const [disabled, setDisabled] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisabled(true);
    const response = await fetch("/api/bookings/create", {
      method: "POST",
      body: JSON.stringify({
        datetime: `${year}-${month}-${day} ${time}`,
        slug: slug,
      }),
    });
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

      <button type="submit" disabled={disabled}>
        Book
      </button>
    </form>
  );
};

export default MakeBookingForm;
