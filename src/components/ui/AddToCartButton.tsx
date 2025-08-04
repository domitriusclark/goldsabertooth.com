import { useState } from 'react';
import { useCartStore } from '../../lib/cart';
import Button from './Button';
import { cx } from '../../utils/classes';

interface AddToCartButtonProps {
  variantId: string | null;
  availableForSale: boolean;
  quantity?: number;
  className?: string;
}

export default function AddToCartButton({ 
  variantId, 
  availableForSale, 
  quantity = 1,
  className 
}: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { add: addToCart, openCart, isLoading: cartLoading, error } = useCartStore();

  const handleAddToCart = async () => {
    if (!variantId || !availableForSale) return;

    setIsAdding(true);
    
    try {
      await addToCart(variantId, quantity);
      
      // Show success state
      setShowSuccess(true);
      
      // Open cart sidebar to show the added item
      setTimeout(() => {
        openCart();
        setShowSuccess(false);
      }, 800);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const isDisabled = !variantId || !availableForSale || isAdding || cartLoading;

  const getButtonText = () => {
    if (!availableForSale) return 'SOLD OUT';
    if (isAdding) return 'ADDING...';
    if (showSuccess) return 'ADDED!';
    return 'ADD TO CART';
  };

  const getButtonVariant = () => {
    if (!availableForSale) return 'ghost';
    if (showSuccess) return 'secondary';
    return 'primary';
  };

  return (
    <div className="space-y-2">
      <Button
        variant={getButtonVariant()}
        size="lg"
        onClick={handleAddToCart}
        disabled={isDisabled}
        isLoading={isAdding}
        className={cx(
          'w-full text-xl py-4',
          showSuccess && 'bg-neon-lime hover:bg-neon-lime-dark animate-pulse',
          className
        )}
      >
        {getButtonText()}
      </Button>

      {/* Error message */}
      {error && (
        <div className="comic-border bg-neon-orange p-3 text-ink text-sm font-body">
          <p>⚠️ {error}</p>
          <button
            onClick={() => useCartStore.getState().clearError()}
            className="underline hover:no-underline mt-1"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Success message */}
      {showSuccess && (
        <div className="comic-border bg-neon-lime p-3 text-ink text-sm font-body text-center">
          <p>🎉 Added to your chaotic collection!</p>
        </div>
      )}
    </div>
  );
}