interface Props {
  rating: number;
  size?: number;
}

export default function StarRating({ rating, size = 14 }: Props) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= Math.floor(rating);
        const partial = !filled && star === Math.ceil(rating) && rating % 1 >= 0.5;
        return (
          <svg key={star} width={size} height={size} viewBox="0 0 24 24">
            <defs>
              <linearGradient id={`half-${star}`}>
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="50%" stopColor="#D1D5DB" />
              </linearGradient>
            </defs>
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              fill={filled ? "#F59E0B" : partial ? `url(#half-${star})` : "#D1D5DB"}
            />
          </svg>
        );
      })}
    </div>
  );
}
