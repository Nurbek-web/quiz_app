import React from "react";
import { useTimer } from "react-timer-hook";

export default function MyTimer({ expiryTimestamp }) {
  const { seconds, minutes, hours, days, isRunning } = useTimer({
    expiryTimestamp,
    onExpire: () => console.warn("onExpire called"),
  });

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "100px" }}>
        <span>{days}</span>:<span>{hours}</span>:<span>{minutes}</span>:
        <span>{seconds}</span>
      </div>
      {isRunning ? <h1>Running</h1> : <h1>Not Running</h1>}
    </div>
  );
}
