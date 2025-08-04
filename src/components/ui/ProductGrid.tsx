import { useState, useEffect } from 'react';
import type { Product } from '../../lib/types';
import ProductCard from './ProductCard';
import Button from './Button';

interface ProductGridProps {
  initialProducts: Product[];
  hasNextPage?: boolean;
  endCursor?: string | null;
  selectedTags?: string[];
}

export default function ProductGrid({ 
  initialProducts, 
  hasNextPage = false, 
  endCursor = null,
  selectedTags = [] 
}: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [currentCursor, setCurrentCursor] = useState(endCursor);
  const [hasNext, setHasNext] = useState(hasNextPage);

  // Reset products when selectedTags change (filter change)
  useEffect(() => {
    setProducts(initialProducts);
    setCurrentCursor(endCursor);
    setHasNext(hasNextPage);
  }, [initialProducts, endCursor, hasNextPage, selectedTags]);

  const loadMore = async () => {
    if (!hasNext || loading) return;

    setLoading(true);

    try {
      // Build query params
      const params = new URLSearchParams();
      if (currentCursor) params.set('cursor', currentCursor);
      if (selectedTags.length > 0) params.set('tag', selectedTags.join(','));

      const response = await fetch(`/api/products?${params.toString()}`);
      const data = await response.json();

      if (response.ok) {
        setProducts(prev => [...prev, ...data.products]);
        setCurrentCursor(data.pageInfo.endCursor);
        setHasNext(data.pageInfo.hasNextPage);
      } else {
        console.error('Failed to load more products:', data.error);
      }
    } catch (error) {
      console.error('Error loading more products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="comic-border bg-paper p-8 max-w-md mx-auto">
          <h3 className="font-display text-2xl text-ink mb-4 outline-text rotate-1">
            NO CHAOS FOUND
          </h3>
          <p className="font-body text-gray-600 mb-6">
            No products match your current filters. Try clearing some filters or browse all products.
          </p>
          <Button
            variant="primary"
            onClick={() => window.location.href = '/shop'}
          >
            BROWSE ALL ART
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Load More Button */}
      {hasNext && (
        <div className="text-center">
          <Button
            variant="secondary"
            size="lg"
            onClick={loadMore}
            isLoading={loading}
            className="min-w-48"
          >
            {loading ? 'LOADING MORE...' : 'LOAD MORE CHAOS'}
          </Button>
        </div>
      )}

      {/* Results summary */}
      <div className="text-center mt-6 text-sm text-gray-400 font-body">
        Showing {products.length} product{products.length !== 1 ? 's' : ''}
        {selectedTags.length > 0 && (
          <span> filtered by: {selectedTags.join(', ')}</span>
        )}
      </div>
    </div>
  );
}