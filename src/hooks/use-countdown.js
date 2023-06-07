import moment from "moment";
import { useState, useEffect } from "react";

function useCountdown(date) {
  const dateWithoutTimeZone = moment
    .utc(date)
    .format("YYYY-MM-DDTHH:mm:ss.SSSS");
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(dateWithoutTimeZone));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(date));
    }, 1000);
    return () => clearInterval(interval);
  }, [date]);

  return timeLeft;
}

function getTimeLeft(targetDate) {
  const target = new Date(
    moment.utc(targetDate).format("YYYY-MM-DDTHH:mm:ss.SSSS")
  );
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0 };
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  return { days, hours, minutes };
}

export default useCountdown;
