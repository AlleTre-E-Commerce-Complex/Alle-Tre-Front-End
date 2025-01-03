import { useState, useEffect } from "react";
import moment from "moment";

function useCountdown(targetDate) {
  // Helper function to calculate time left
  const calculateTimeLeft = () => {
    const now = new Date();
    const target = moment(targetDate).toDate();
    const diff = target - now;

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / 1000 / 60) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };

  // Initialize state with the calculated time left
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

  useEffect(() => {
    // Update time left every second
    const intervalId = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [targetDate]);

  return timeLeft;
}

export default useCountdown;

// import moment from "moment";
// import { useState, useEffect } from "react";

// function useCountdown(date) {
//   const dateWithoutTimeZone = moment(date)
//     .local()
//     .format("YYYY-MM-DDTHH:mm:ss.SSS");

//   const [timeLeft, setTimeLeft] = useState(getTimeLeft(dateWithoutTimeZone));

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setTimeLeft(getTimeLeft(date));
//     }, 1000);
//     return () => clearInterval(interval);
//   }, [date]);

//   return timeLeft;
// }

// function getTimeLeft(targetDate) {
//   const target = new Date(
//     moment(targetDate).local().format("YYYY-MM-DDTHH:mm:ss.SSSS")
//   );
//   const now = new Date();
//   const diff = target.getTime() - now.getTime();
//   if (diff <= 0) {
//     return { days: 0, hours: 0, minutes: 0, seconds: 0 };
//   }
//   const days = Math.floor(diff / (1000 * 60 * 60 * 24));
//   const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
//   const minutes = Math.floor((diff / 1000 / 60) % 60);
//   const seconds = Math.floor((diff / 1000) % 60);
//   return { days, hours, minutes, seconds };
// }

// export default useCountdown;
