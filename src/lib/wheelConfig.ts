export interface Segment {
  label: string;
  value: number;
  color: string;
}

export const segments: Segment[] = [
  { label: '৳1', value: 1, color: '#3b82f6' },
  { label: '৳2', value: 2, color: '#8b5cf6' },
  { label: '৳5', value: 5, color: '#06b6d4' },
  { label: '৳10', value: 10, color: '#ec4899' },
  { label: '৳20', value: 20, color: '#6366f1' },
  { label: '৳50', value: 50, color: '#14b8a6' },
  { label: '৳100', value: 100, color: '#f59e0b' },
  { label: '৳200', value: 200, color: '#e879f9' },
  { label: '৳500', value: 500, color: '#22d3ee' },
  { label: '৳1000', value: 1000, color: '#fbbf24' },
];

const weightedValues = [
  // High values (~65%, mostly 500 and 1000)
  200,
  500, 500, 500, 500, 500,
  1000, 1000, 1000, 1000, 1000, 1000,
  // Medium
  50, 50, 50,
  // Low values
  1, 2, 5, 10, 20,
];

export function getRandomIndex(): number {
  const selectedValue = weightedValues[Math.floor(Math.random() * weightedValues.length)];
  return segments.findIndex((s) => s.value === selectedValue);
}
