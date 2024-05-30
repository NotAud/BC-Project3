import { useEffect, useState } from 'react';

function containsOnlyDigits(str) {
    return /^\d+$/.test(str);
}

function convertBadTimestamp(value) {
    if (typeof value === "string" && containsOnlyDigits(value)) {
        // If the value is a string, parse it as a number (assuming it's an epoch string)
        const timestamp = parseInt(value, 10);
        if (!isNaN(timestamp)) {
          // If the parsed value is a valid number, convert it to a Date object
          return new Date(timestamp);
        }
    }

    return value;
}

function clamp(val, min, max) {
    return val > max ? max : val < min ? min : val;
}

export default function CountdownTimer({ roundTimestamp, roundTime }) {
    const [remainingTime, setRemainingTime] = useState(0);

    useEffect(() => {
        formatTime();

        const timer = setInterval(() => {
            formatTime();
        }, 100);

        return () => {
            clearInterval(timer);
        };
    }, [roundTimestamp, roundTime]);

    function formatTime() {
        const timestamp = convertBadTimestamp(roundTimestamp);

        const roundEpoch = Math.floor(new Date(timestamp).getTime() / 1000);
        const currentTime = Math.floor(new Date().getTime() / 1000);
        const elapsedTime = clamp(currentTime - roundEpoch, 0, roundTime);
        const remainingSeconds = Math.max(0, Math.floor((roundTime - elapsedTime)));
        setRemainingTime(remainingSeconds);
    }

    const progressPercentage = (remainingTime / roundTime) * 100;

    return (
        <div className="flex items-center gap-x-2 countdown-timer">
            <div className="countdown-text">{remainingTime}</div>
            <div className="w-[16px] h-[16px]">
                <svg viewBox="0 0 100 100">
                    <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#e0e0e0"
                    strokeWidth="10"
                    />
                    <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#4caf50"
                    strokeWidth="10"
                    strokeDasharray="283"
                    strokeDashoffset={`${(1 - progressPercentage / 100) * 283}`}
                    transform="rotate(-90 50 50)"
                    />
                </svg>
            </div>
        </div>
    );
}