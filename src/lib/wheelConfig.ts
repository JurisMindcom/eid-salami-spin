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

const LOW_VALUES = [1, 2, 5, 10, 20, 50];

// 12-spin pool: 2×1000, 2×500, 2×200, 1×100, 5 random low
function generatePool(): number[] {
  const pool: number[] = [1000, 1000, 500, 500, 200, 200, 100];
  for (let i = 0; i < 5; i++) {
    pool.push(LOW_VALUES[Math.floor(Math.random() * LOW_VALUES.length)]);
  }
  // Shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool;
}

let spinPool: number[] = [];
let spinCount = 0;
let lastValue = -1;

export function getNextValue(): number {
  spinCount++;

  // Every 4th spin → forced low value
  if (spinCount % 4 === 0) {
    let val: number;
    do {
      val = LOW_VALUES[Math.floor(Math.random() * LOW_VALUES.length)];
    } while (val === lastValue);
    lastValue = val;
    return val;
  }

  // Pool logic
  if (spinPool.length === 0) {
    spinPool = generatePool();
  }

  let val: number | undefined;
  // Try to pick a value that's not the same as last
  for (let i = 0; i < spinPool.length; i++) {
    if (spinPool[i] !== lastValue) {
      val = spinPool.splice(i, 1)[0];
      break;
    }
  }
  if (val === undefined) {
    val = spinPool.shift()!;
  }

  lastValue = val;
  return val;
}

export function getRandomIndex(): number {
  const selectedValue = getNextValue();
  return segments.findIndex((s) => s.value === selectedValue);
}
