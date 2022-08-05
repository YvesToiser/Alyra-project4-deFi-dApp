import Big from "big.js";

export function roundNumbers(number, decimal = 2) {
  return Math.round(number * Math.pow(10, decimal)) / Math.pow(10, decimal);
}

export function truncNumbers(number, decimal = 2) {
  return Math.trunc(number * Math.pow(10, decimal)) / Math.pow(10, decimal);
}

export function tokenDecimal(number, decimal = 18) {
  return new Big(number).mul(10 ** decimal);
}