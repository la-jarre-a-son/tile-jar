/**
 * Returns an array with a range of elements from a to b (included),
 * each elements is an incrementing number in the range.
 *
 * If the end element is lower than a step value, the end of the array
 * does not obey step and stops at end.
 *
 * @param a - the start
 * @param b - the end (included)
 * @param step - the step
 * @returns {number[]}
 */
export const range = (a: number, b: number, step: number = 1) =>
  Array(Math.ceil(Math.abs(a - b) / step) + 1)
    .fill(null)
    .map((_v, i, arr) => (i === arr.length - 1 ? b : a + step * i * (a < b ? 1 : -1)));

/**
 * Returns a random element in array.
 *
 * @param arr - the array to pick from
 * @returns {any}
 */
export const randomPick = <T>(arr: T[]): T => arr[(Math.random() * arr.length) >> 0];
