import type { Money } from '../../lib/types';

interface PriceProps {
  money: Money;
  className?: string;
}

export default function Price({ money, className = '' }: PriceProps) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: money.currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  const formattedPrice = formatter.format(parseFloat(money.amount));

  return (
    <span className={className}>
      {formattedPrice}
    </span>
  );
}