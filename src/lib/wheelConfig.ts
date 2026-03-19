export interface Segment {
  label: string;
  value: number;
  color: string;
  weight: number;
}

export const segments: Segment[] = [
  { label: '৳1', value: 1, color: '#3b82f6', weight: 25 },
  { label: '৳2', value: 2, color: '#8b5cf6', weight: 20 },
  { label: '৳5', value: 5, color: '#06b6d4', weight: 18 },
  { label: '৳10', value: 10, color: '#ec4899', weight: 12 },
  { label: '৳20', value: 20, color: '#6366f1', weight: 10 },
  { label: '৳50', value: 50, color: '#14b8a6', weight: 6 },
  { label: '৳100', value: 100, color: '#f59e0b', weight: 4 },
  { label: '৳200', value: 200, color: '#e879f9', weight: 2.5 },
  { label: '৳500', value: 500, color: '#22d3ee', weight: 1.5 },
  { label: '৳1000', value: 1000, color: '#fbbf24', weight: 1 },
];

export function getWeightedRandomIndex(): number {
  const totalWeight = segments.reduce((sum, s) => sum + s.weight, 0);
  let random = Math.random() * totalWeight;
  for (let i = 0; i < segments.length; i++) {
    random -= segments[i].weight;
    if (random <= 0) return i;
  }
  return 0;
}
