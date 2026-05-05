import { Star } from "lucide-react";

const Rating = ({ value = 0, count }) => (
  <div className="flex items-center gap-1 text-sm text-amber-500">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star key={star} size={16} fill={star <= Math.round(value) ? "currentColor" : "none"} />
    ))}
    {count !== undefined && <span className="ml-2 text-xs font-medium text-ink/55">({count})</span>}
  </div>
);

export default Rating;
