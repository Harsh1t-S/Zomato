import { Star } from 'lucide-react';

export default function RatingBadge({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'text-xs px-1.5 py-0.5 gap-0.5',
    md: 'text-sm px-2 py-1 gap-1',
    lg: 'text-base px-2.5 py-1.5 gap-1',
  };
  const starSizes = { sm: 'w-2.5 h-2.5', md: 'w-3 h-3', lg: 'w-4 h-4' };
  const color = rating >= 4.0 ? '#267E3E' : rating >= 3.0 ? '#E5A800' : '#CB202D';

  return (
    <span
      className={`inline-flex items-center font-semibold text-white rounded ${sizes[size]}`}
      style={{ backgroundColor: color }}
    >
      <span>{rating}</span>
      <Star className={`${starSizes[size]} fill-white`} />
    </span>
  );
}
