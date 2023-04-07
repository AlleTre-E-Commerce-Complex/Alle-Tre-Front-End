import React from "react";
import useCountdown from "../../../hooks/use-countdown";

function CountdownTimer({ date }) {
  const timeLeft = useCountdown(date);
  const formattedTimeLeft = `${timeLeft.days} days : ${timeLeft.hours} hrs : ${timeLeft.minutes} min`;

  return (
    <div>
      <p>{formattedTimeLeft}</p>
    </div>
  );
}

export default CountdownTimer;
