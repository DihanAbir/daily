import { hoursPerDay, millisecondsPerSecond, minutesPerHour, secondsPerMinute } from "./constants/timeConstantHelpers";

function numberToWords(num: number) {
    const belowTwenty = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
    const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

    if (num < 20) return belowTwenty[num];
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? " " + belowTwenty[num % 10] : "");
    if (num < 1000) return belowTwenty[Math.floor(num / 100)] + " hundred" + (num % 100 !== 0 ? " " + numberToWords(num % 100) : "");

    return "Number out of range";
}

// export methods:

export function numberToDaysInWords(num: number) {
    return numberToWords(num) + " days";
}

export function convertDayToMilliseconds(days: number) {
    // Calculate milliseconds
    const milliseconds = days * hoursPerDay * minutesPerHour * secondsPerMinute * millisecondsPerSecond;
    return milliseconds;
}