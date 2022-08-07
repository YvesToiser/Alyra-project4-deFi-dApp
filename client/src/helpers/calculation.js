import Big from "big.js";

export function roundNumbers(number, decimal = 2) {
  return Math.round(number * Math.pow(10, decimal)) / Math.pow(10, decimal);
}

export function truncNumbers(number, decimal = 2) {
  return Math.trunc(number * Math.pow(10, decimal)) / Math.pow(10, decimal);
}

export function tokenDecimalDiv(number, decimal = 18) {
  return number.div(10 ** decimal);
}

export function tokenDecimalMul(number, decimal = 18) {
  return number.mul(10 ** decimal);
}

export function tokenRound(number, decimal = 18) {
  if (typeof number === "number" || typeof number === "string") return number;
  try {
    return number.div(10 ** decimal).round(2, Big.roundDown);
  } catch (error) {
    console.error("----- Error: " + error);
  }
}
