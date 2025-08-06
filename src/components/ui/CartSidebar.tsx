import { useEffect } from "react";
import { useCartStore } from "../../lib/cart";
import { cx } from "../../utils/classes";
import Button from "./Button";
import Price from "./Price";

export default function CartSidebar() {
  const {
    cart,
    isOpen,
    isLoading,
    error,
    closeCart,
    updateQuantity,
    remove,
    clearError,
  } = useCartStore();

  // Compute values directly from cart
  const totalQuantity = cart?.totalQuantity || 0;
  const isEmpty = totalQuantity === 0;
  const subtotal = !cart
    ? "$0.00"
    : new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: cart.cost.subtotalAmount.currencyCode,
      }).format(parseFloat(cart.cost.subtotalAmount.amount));

  // Close cart on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeCart();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, closeCart]);

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
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
        className="z-40 fixed inset-0 bg-black bg-opacity-50"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <div
        className={cx(
          "fixed top-0 right-0 h-full w-full max-w-md bg-paper z-50",
          "transform transition-transform duration-300 ease-out",
          "comic-border shadow-2xl overflow-hidden",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center bg-electric-blue p-4 border-ink border-b-2">
            <h2 className="font-display font-black text-ink text-xl">
              YOUR CHAOS ({cart?.totalQuantity || 0})
            </h2>
            <button
              onClick={closeCart}
              className="flex justify-center items-center bg-neon-orange hover:bg-neon-orange-dark comic-border-sm w-8 h-8 font-bold text-ink transition-colors"
              aria-label="Close cart"
            >
              ×
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-neon-orange p-4 border-ink border-b-2">
              <p className="font-body text-ink text-sm">⚠️ {error}</p>
              <button
                onClick={clearError}
                className="mt-1 text-xs underline hover:no-underline"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="bg-neon-lime p-4 border-ink border-b-2">
              <p className="font-body text-ink text-sm">🔄 Updating cart...</p>
            </div>
          )}

          {/* Cart Items */}
          <div className="flex-1 p-4 overflow-y-auto">
            {isEmpty ? (
              <div className="py-12 text-center">
                <div className="mb-4 text-6xl">🛒</div>
                <h3 className="mb-2 font-display text-ink text-xl">
                  Empty Cart
                </h3>
                <p className="mb-6 font-body text-gray-600">
                  Your chaotic collection awaits! Add some underground art to
                  get started.
                </p>
                <Button
                  variant="primary"
                  onClick={() => {
                    closeCart();
                    window.location.href = "/shop";
                  }}
                >
                  BROWSE ART
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart?.lines.map((line) => (
                  <div key={line.id} className="bg-paper p-4 comic-border">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      {line.merchandise.product.featuredImage ? (
                        <img
                          src={line.merchandise.product.featuredImage.url}
                          alt={
                            line.merchandise.product.featuredImage.altText ||
                            line.merchandise.product.title
                          }
                          className="comic-border-sm w-16 h-16 object-cover"
                        />
                      ) : (
                        <div className="flex justify-center items-center bg-gray-200 comic-border-sm w-16 h-16">
                          <span className="text-gray-500 text-xs">
                            No Image
                          </span>
                        </div>
                      )}

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-body font-medium text-ink text-sm truncate">
                          {line.merchandise.product.title}
                        </h4>
                        {line.merchandise.selectedOptions.length > 0 && (
                          <p className="font-body text-gray-600 text-xs">
                            {line.merchandise.selectedOptions
                              .map((option) => option.value)
                              .join(", ")}
                          </p>
                        )}

                        {/* Quantity Controls */}
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  line.id,
                                  Math.max(0, line.quantity - 1)
                                )
                              }
                              disabled={isLoading || line.quantity <= 1}
                              className="flex justify-center items-center bg-gray-200 hover:bg-gray-300 disabled:opacity-50 comic-border-sm w-6 h-6 text-black text-xs"
                            >
                              −
                            </button>
                            <span className="min-w-[2ch] font-medium text-black text-sm text-center">
                              {line.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(line.id, line.quantity + 1)
                              }
                              disabled={isLoading}
                              className="flex justify-center items-center bg-gray-200 hover:bg-gray-300 disabled:opacity-50 comic-border-sm w-6 h-6 text-black text-xs"
                            >
                              +
                            </button>
                          </div>

                          <div className="text-right">
                            <div className="font-bold text-black text-sm">
                              <Price money={line.cost.totalAmount} />
                            </div>
                            <button
                              onClick={() => remove(line.id)}
                              disabled={isLoading}
                              className="disabled:opacity-50 text-red-600 hover:text-red-800 text-xs underline"
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
            <div className="bg-ink p-4 border-ink border-t-2">
              <div className="flex justify-between items-center mb-4">
                <span className="font-display text-paper text-lg">
                  SUBTOTAL:
                </span>
                <span className="font-display text-electric-blue text-xl">
                  {subtotal}
                </span>
              </div>

              <Button
                variant="primary"
                size="lg"
                onClick={handleCheckout}
                disabled={isLoading}
                className="py-4 w-full text-xl"
              >
                CHECKOUT →
              </Button>

              <p className="mt-2 font-body text-gray-400 text-xs text-center">
                Secure checkout powered by Shopify
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
