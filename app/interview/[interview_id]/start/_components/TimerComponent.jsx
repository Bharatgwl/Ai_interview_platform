"use client";

import React, { useEffect, useState } from 'react';

const TimerComponent = ({ start }) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval = null;

    if (start) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setSeconds(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [start]);

  const formatTime = (totalSeconds) => {
    const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const secs = String(totalSeconds % 60).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  return (
    <span className="font-mono text-sm text-gray-700">
      {formatTime(seconds)}
    </span>
  );
};

export default TimerComponent;
