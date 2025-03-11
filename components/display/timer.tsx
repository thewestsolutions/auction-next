"use client";

import { useEffect, useState } from "react";

export default function Timer({
  timeLeft,
  onExpired,
}: {
  timeLeft: string;
  onExpired?: (isExpired: boolean) => void;
}) {
  // Calculate seconds remaining from ISO date string
  const calculateTimeRemaining = (endTimeStr: string): number => {
    const endTime = new Date(endTimeStr).getTime();
    const now = new Date().getTime();
    const diff = endTime - now;

    // Return seconds remaining (or 0 if expired)
    return Math.max(0, Math.floor(diff / 1000));
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

  // Initial calculation
  const initialSeconds = calculateTimeRemaining(timeLeft);
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

    // Update the timer every second
    const timer = setInterval(() => {
      const secondsLeft = calculateTimeRemaining(timeLeft);

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
  }, [timeLeft, onExpired, initialSeconds]);

  return remainingTime;
}
