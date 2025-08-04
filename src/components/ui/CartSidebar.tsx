import { useEffect } from 'react';
import { useCartStore } from '../../lib/cart';
import { cx } from '../../utils/classes';
import Button from './Button';
import Price from './Price';

export default function CartSidebar() {
  const { 
    cart, 
    isOpen, 
    isLoading, 
    error, 
    isEmpty, 
    subtotal,
    closeCart, 
    updateQuantity, 
    remove, 
    clearError 
  } = useCartStore();

  // Debug logging
  useEffect(() => {
    console.log('🎯 CART SIDEBAR - Cart state changed:', {
      cart,
      isEmpty,
      totalQuantity: cart?.totalQuantity || 0,
      linesCount: cart?.lines?.length || 0
    });
  }, [cart, isEmpty]);

  // Close cart on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeCart();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeCart]);

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCheckout = () => {
    if (cart?.checkoutUrl) {
      window.location.href = cart.checkoutUrl;
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <div
        className={cx(
          'fixed top-0 right-0 h-full w-full max-w-md bg-paper z-50',
          'transform transition-transform duration-300 ease-out',
          'comic-border shadow-2xl overflow-hidden',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b-2 border-ink bg-electric-blue">
            <h2 className="font-display text-xl text-ink font-black">
              YOUR CHAOS ({cart?.totalQuantity || 0})
            </h2>
            <button
              onClick={closeCart}
              className="w-8 h-8 flex items-center justify-center comic-border-sm bg-neon-orange hover:bg-neon-orange-dark text-ink font-bold transition-colors"
              aria-label="Close cart"
            >
              ×
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-neon-orange border-b-2 border-ink">
              <p className="text-ink text-sm font-body">⚠️ {error}</p>
              <button
                onClick={clearError}
                className="underline text-xs hover:no-underline mt-1"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="p-4 bg-neon-lime border-b-2 border-ink">
              <p className="text-ink text-sm font-body">🔄 Updating cart...</p>
            </div>
          )}

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {isEmpty ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🛒</div>
                <h3 className="font-display text-xl text-ink mb-2">Empty Cart</h3>
                <p className="text-gray-600 font-body mb-6">
                  Your chaotic collection awaits! Add some underground art to get started.
                </p>
                <Button
                  variant="primary"
                  onClick={() => {
                    closeCart();
                    window.location.href = '/shop';
                  }}
                >
                  BROWSE ART
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart?.lines.map((line) => (
                  <div key={line.id} className="comic-border bg-paper p-4">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      {line.merchandise.product.featuredImage ? (
                        <img
                          src={line.merchandise.product.featuredImage.url}
                          alt={line.merchandise.product.featuredImage.altText || line.merchandise.product.title}
                          className="w-16 h-16 object-cover comic-border-sm"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 comic-border-sm flex items-center justify-center">
                          <span className="text-xs text-gray-500">No Image</span>
                        </div>
                      )}

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-body font-medium text-ink text-sm truncate">
                          {line.merchandise.product.title}
                        </h4>
                        {line.merchandise.selectedOptions.length > 0 && (
                          <p className="text-xs text-gray-600 font-body">
                            {line.merchandise.selectedOptions.map(option => option.value).join(', ')}
                          </p>
                        )}

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(line.id, Math.max(0, line.quantity - 1))}
                              disabled={isLoading || line.quantity <= 1}
                              className="w-6 h-6 flex items-center justify-center text-xs bg-gray-200 hover:bg-gray-300 disabled:opacity-50 comic-border-sm"
                            >
                              −
                            </button>
                            <span className="text-sm font-medium min-w-[2ch] text-center">
                              {line.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(line.id, line.quantity + 1)}
                              disabled={isLoading}
                              className="w-6 h-6 flex items-center justify-center text-xs bg-gray-200 hover:bg-gray-300 disabled:opacity-50 comic-border-sm"
                            >
                              +
                            </button>
                          </div>

                          <div className="text-right">
                            <div className="font-bold text-sm">
                              <Price money={line.cost.totalAmount} />
                            </div>
                            <button
                              onClick={() => remove(line.id)}
                              disabled={isLoading}
                              className="text-xs text-red-600 hover:text-red-800 underline disabled:opacity-50"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer - Checkout */}
          {!isEmpty && cart && (
            <div className="border-t-2 border-ink p-4 bg-ink">
              <div className="flex justify-between items-center mb-4">
                <span className="font-display text-lg text-paper">SUBTOTAL:</span>
                <span className="font-display text-xl text-electric-blue">
                  {subtotal}
                </span>
              </div>
              
              <Button
                variant="primary"
                size="lg"
                onClick={handleCheckout}
                disabled={isLoading}
                className="w-full text-xl py-4"
              >
                CHECKOUT →
              </Button>
              
              <p className="text-xs text-gray-400 text-center mt-2 font-body">
                Secure checkout powered by Shopify
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}