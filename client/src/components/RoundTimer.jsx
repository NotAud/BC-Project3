import { useEffect, useState } from 'react';

function containsOnlyDigits(str) {
    return /^\d+$/.test(str);
}

function convertBadTimestamp(value) {
    if (typeof value === "string" && containsOnlyDigits(value)) {
        // If the value is a string, parse it as a number (assuming it's an epoch string)
        const timestamp = parseInt(value, 10);
        console.log("bad", value, timestamp)
        if (!isNaN(timestamp)) {
          // If the parsed value is a valid number, convert it to a Date object
          return new Date(timestamp);
        }
    }

    return value;
}

export default function CountdownTimer({ roundTimestamp, roundTime }) {
    const [remainingTime, setRemainingTime] = useState(0);

    useEffect(() => {
        const timestamp = convertBadTimestamp(roundTimestamp);

        const timer = setInterval(() => {
            const roundEpoch = new Date(timestamp).getTime() / 1000;
            const currentTime = new Date().getTime() / 1000;
            const elapsedTime = currentTime - roundEpoch;
            console.log(currentTime, roundEpoch, elapsedTime)
            const remainingSeconds = Math.max(0, Math.floor((roundTime - elapsedTime)));
            console.log(remainingSeconds)
            setRemainingTime(remainingSeconds);
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, [roundTimestamp, roundTime]);

    const progressPercentage = (remainingTime / roundTime) * 100;

    return (
        <div className="countdown-timer">
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
        <div className="countdown-text">{remainingTime}s</div>
        </div>
    );
}