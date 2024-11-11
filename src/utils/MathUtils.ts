/** Math */
export const limitNum = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);
export const isInRange = (num: number, min: number, max: number) => num >= min && num <= max;

export const MathUtils = {
  limitNum,
  isInRange
};