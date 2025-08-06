import { useState } from 'react';
import type { Product } from '../../lib/types';
import Price from './Price';
import { cx } from '../../utils/classes';
import { useCartStore } from '../../lib/cart';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isQuickAdding, setIsQuickAdding] = useState(false);
  const [showQuickSuccess, setShowQuickSuccess] = useState(false);
  const { add: addToCart, openCart, isLoading: cartLoading } = useCartStore();
  
  const featuredImage = product.images[0];
  const minPrice = product.priceRange.minVariantPrice;
  const maxPrice = product.priceRange.maxVariantPrice;
  const hasVariablePrice = minPrice.amount !== maxPrice.amount;
  
  // Get default variant (first available variant)
  const defaultVariant = product.variants.find(variant => variant.availableForSale) || product.variants[0];

  // Generate random rotation for each card
  const rotations = ['-rotate-1', 'rotate-1', '-rotate-2', 'rotate-2', 'rotate-0'];
  const randomRotation = rotations[Math.floor(Math.random() * rotations.length)];

  const handleQuickAdd = async () => {
    if (!defaultVariant || !product.availableForSale) return;

    setIsQuickAdding(true);
    
    try {
      await addToCart(defaultVariant.id, 1);
      
      // Show success state
      setShowQuickSuccess(true);
      
      // Open cart sidebar to show the added item
      setTimeout(() => {
        openCart();
        setShowQuickSuccess(false);
      }, 800);
    } catch (error) {
      console.error('Failed to quick add to cart:', error);
    } finally {
      setIsQuickAdding(false);
    }
  };

  return (
    <article
      className={cx(
        'group relative comic-border bg-paper overflow-hidden',
        'transition-all duration-300 hover:scale-105 hover:rotate-0',
        'focus-within:ring-2 focus-within:ring-electric-blue focus-within:ring-offset-2 focus-within:ring-offset-ink',
        randomRotation
      )}
    >
      <a 
        href={`/shop/${product.handle}`}
        className="block focus:outline-none"
        aria-label={`View ${product.title} product details`}
      >
        {/* Image */}
        <div className="aspect-square overflow-hidden bg-gray-100">
          {featuredImage ? (
            <img
              src={featuredImage.url}
              alt={featuredImage.altText || product.title}
              width={featuredImage.width}
              height={featuredImage.height}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <span className="text-gray-400 font-body text-sm">No Image</span>
            </div>
          )}

          {!product.availableForSale && (
            <div className="absolute inset-0 bg-ink bg-opacity-75 flex items-center justify-center">
              <span className="font-display text-xl text-neon-orange outline-text transform -rotate-12">
                SOLD OUT
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-display text-lg text-ink mb-2 line-clamp-2 group-hover:text-electric-blue transition-colors duration-200">
            {product.title}
          </h3>
          
          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="font-body text-lg font-bold text-ink">
              {hasVariablePrice ? (
                <span>
                  FROM <Price money={minPrice} />
                </span>
              ) : (
                <Price money={minPrice} />
              )}
            </div>
            
            {product.productType && (
              <span className="px-2 py-1 text-xs font-body bg-neon-lime text-ink comic-border-sm">
                {product.productType.toUpperCase()}
              </span>
            )}
          </div>

          {/* Tags */}
          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {product.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs font-body bg-gray-100 text-gray-600 rounded-full"
                >
                  {tag}
                </span>
              ))}
              {product.tags.length > 3 && (
                <span className="px-2 py-1 text-xs font-body bg-gray-100 text-gray-600 rounded-full">
                  +{product.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </a>

      {/* Quick add button (appears on hover) */}
      <div className="absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleQuickAdd();
          }}
          disabled={!product.availableForSale || isQuickAdding || cartLoading}
          className={cx(
            'w-full py-2 font-display text-sm comic-border-sm',
            'btn-psychedelic transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-electric-blue',
            showQuickSuccess 
              ? 'bg-neon-lime hover:bg-neon-lime-dark animate-pulse'
              : 'bg-electric-blue hover:bg-electric-blue-dark',
            'text-ink',
            (!product.availableForSale || isQuickAdding || cartLoading) && 'opacity-50 cursor-not-allowed'
          )}
        >
          {!product.availableForSale 
            ? 'SOLD OUT' 
            : isQuickAdding 
              ? 'ADDING...' 
              : showQuickSuccess 
                ? 'ADDED!' 
                : 'QUICK ADD'
          }
        </button>
      </div>
    </article>
  );
}