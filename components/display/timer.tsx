"use client";

import { useEffect, useState } from "react";

export default function Timer({
  timeLeft,
  onExpired,
}: {
  timeLeft: string;
  onExpired?: (isExpired: boolean) => void;
}) {
  // Parse the time string (e.g., "5h 30m" or "2d 12h")
  const parseTimeString = (timeStr: string) => {
    const parts = timeStr.split(" ");
    let totalSeconds = 0;

    parts.forEach((part) => {
      const value = parseInt(part);
      const unit = part.replace(/[0-9]/g, "");

      if (unit === "d") totalSeconds += value * 86400;
      else if (unit === "h") totalSeconds += value * 3600;
      else if (unit === "m") totalSeconds += value * 60;
      else if (unit === "s") totalSeconds += value;
    });

    return totalSeconds;
  };

  // Convert seconds to formatted time string with max 2 units
  const formatTimeString = (seconds: number) => {
    if (seconds <= 0) return "Expired";

    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    let result = "";
    let unitCount = 0;

    if (days > 0 && unitCount < 2) {
      result += `${days}d `;
      unitCount++;
    }

    if (hours > 0 && unitCount < 2) {
      result += `${hours}h `;
      unitCount++;
    }

    if (minutes > 0 && unitCount < 2) {
      result += `${minutes}m `;
      unitCount++;
    }

    if (secs > 0 && unitCount < 2) {
      result += `${secs}s`;
      unitCount++;
    }

    return result.trim();
  };

  // Initial parsing
  const initialSeconds = parseTimeString(timeLeft);
  const initialTimeDisplay = initialSeconds <= 0 ? "Expired" : formatTimeString(initialSeconds);

  const [remainingTime, setRemainingTime] = useState(initialTimeDisplay);

  useEffect(() => {
    // Set the initial time display immediately
    if (initialSeconds <= 0) {
      setRemainingTime("Expired");
      onExpired?.(true);
    } else {
      setRemainingTime(formatTimeString(initialSeconds));
      onExpired?.(false);
    }

    let secondsLeft = initialSeconds;

    // Update the timer every second
    const timer = setInterval(() => {
      secondsLeft -= 1;
      if (secondsLeft <= 0) {
        clearInterval(timer);
        setRemainingTime("Expired");
        onExpired?.(true);
      } else {
        setRemainingTime(formatTimeString(secondsLeft));
        onExpired?.(false);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [initialSeconds, timeLeft, onExpired]);

  return remainingTime;
}
