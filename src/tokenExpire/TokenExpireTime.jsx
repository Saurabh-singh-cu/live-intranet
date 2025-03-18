import { useEffect, useState } from "react";

const TokenExpireTime = ({ onLogout }) => {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData || !userData.token_expiration_time) {
      onLogout();
      return;
    }

    // Convert expiration time to milliseconds
    const expirationTime = new Date(userData.token_expiration_time).getTime();
    const currentTime = new Date().getTime();
    const timeRemaining = expirationTime - currentTime;

    if (timeRemaining <= 0) {
      onLogout();
    } else {
      setTimeLeft(timeRemaining);

      // Start an interval to update countdown every second
      const timer = setInterval(() => {
        const newTimeLeft = expirationTime - new Date().getTime();
        if (newTimeLeft <= 0) {
          clearInterval(timer);
          onLogout();
        } else {
          setTimeLeft(newTimeLeft);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [onLogout]);

  // Convert milliseconds to minutes and seconds
  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  return <div style={{color:"red"}}>Session expires in: {timeLeft ? formatTime(timeLeft) : "Expired"}</div>;
};

export default TokenExpireTime;
