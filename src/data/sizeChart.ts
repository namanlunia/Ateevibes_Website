// PLACEHOLDER: Size measurements pending brand confirmation (tracked in /TODO.md)
export interface SizeMeasurement {
  size: 'S' | 'M' | 'L' | 'XL' | 'XXL';
  chestInches: number;
  chestCm: number;
  lengthInches: number;
  lengthCm: number;
  shoulderInches: number;
  shoulderCm: number;
  sleeveHalfInches: number;
  sleeveFullInches: number;
}

export const SIZE_CHART: SizeMeasurement[] = [
  {
    size: 'S',
    chestInches: 38,
    chestCm: 96.5,
    lengthInches: 27,
    lengthCm: 68.5,
    shoulderInches: 17,
    shoulderCm: 43.2,
    sleeveHalfInches: 8.5,
    sleeveFullInches: 24.5,
  },
  {
    size: 'M',
    chestInches: 40,
    chestCm: 101.6,
    lengthInches: 28,
    lengthCm: 71.1,
    shoulderInches: 18,
    shoulderCm: 45.7,
    sleeveHalfInches: 9.0,
    sleeveFullInches: 25.0,
  },
  {
    size: 'L',
    chestInches: 42,
    chestCm: 106.7,
    lengthInches: 29,
    lengthCm: 73.7,
    shoulderInches: 19,
    shoulderCm: 48.3,
    sleeveHalfInches: 9.5,
    sleeveFullInches: 25.5,
  },
  {
    size: 'XL',
    chestInches: 44,
    chestCm: 111.8,
    lengthInches: 30,
    lengthCm: 76.2,
    shoulderInches: 20,
    shoulderCm: 50.8,
    sleeveHalfInches: 10.0,
    sleeveFullInches: 26.0,
  },
  {
    size: 'XXL',
    chestInches: 46,
    chestCm: 116.8,
    lengthInches: 31,
    lengthCm: 78.7,
    shoulderInches: 21,
    shoulderCm: 53.3,
    sleeveHalfInches: 10.5,
    sleeveFullInches: 26.5,
  },
];

export const FIT_NOTES = [
  'Modern Regular Fit: designed to drape naturally through the torso with comfortable ease across shoulders and chest.',
  'If you prefer a relaxed or slightly oversized streetwear silhouette, consider sizing up one size.',
  'China Jacquard & 2-Way knit styles contain built-in recovery stretch for maximum mobility.',
];
