import { useState, useEffect } from 'react';
import type { Product, ProductVariant } from '../../lib/types';
import { cx } from '../../utils/classes';

interface VariantSelectorProps {
  product: Product;
  selectedOptions: Record<string, string>;
  onSelectionChange: (options: Record<string, string>) => void;
}

export default function VariantSelector({ 
  product, 
  selectedOptions, 
  onSelectionChange 
}: VariantSelectorProps) {
  const [currentSelected, setCurrentSelected] = useState<Record<string, string>>(selectedOptions);

  // Initialize with first available variant if none selected
  useEffect(() => {
    if (Object.keys(currentSelected).length === 0 && product.variants.length > 0) {
      const firstVariant = product.variants[0];
      const initialOptions: Record<string, string> = {};
      
      firstVariant.selectedOptions.forEach(option => {
        initialOptions[option.name] = option.value;
      });
      
      setCurrentSelected(initialOptions);
      onSelectionChange(initialOptions);
    }
  }, [product, currentSelected, onSelectionChange]);

  const handleOptionChange = (optionName: string, value: string) => {
    const newSelection = {
      ...currentSelected,
      [optionName]: value,
    };
    
    setCurrentSelected(newSelection);
    onSelectionChange(newSelection);
  };

  // Find matching variant for current selection
  const findMatchingVariant = (): ProductVariant | null => {
    return product.variants.find(variant => {
      return variant.selectedOptions.every(option => 
        currentSelected[option.name] === option.value
      );
    }) || null;
  };

  const selectedVariant = findMatchingVariant();

  if (product.options.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {product.options.map((option) => (
        <div key={option.id}>
          <label className="block font-display text-lg text-ink mb-3 outline-text">
            {option.name}:
            {currentSelected[option.name] && (
              <span className="ml-2 text-electric-blue">
                {currentSelected[option.name]}
              </span>
            )}
          </label>
          
          <div className="flex flex-wrap gap-2">
            {option.values.map((value) => {
              const isSelected = currentSelected[option.name] === value;
              
              // Check if this option combination would result in an available variant
              const testSelection = { ...currentSelected, [option.name]: value };
              const wouldBeAvailable = product.variants.some(variant => {
                return variant.selectedOptions.every(opt => 
                  testSelection[opt.name] === opt.value
                ) && variant.availableForSale;
              });

              return (
                <button
                  key={value}
                  onClick={() => handleOptionChange(option.name, value)}
                  disabled={!wouldBeAvailable}
                  className={cx(
                    'px-4 py-2 font-body text-sm border-2 transition-all duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-electric-blue',
                    isSelected
                      ? 'border-electric-blue bg-electric-blue text-ink comic-border-sm scale-105 rotate-1'
                      : wouldBeAvailable
                        ? 'border-ink bg-paper text-ink hover:border-electric-blue hover:bg-electric-blue hover:text-ink comic-border-sm hover:scale-105 hover:rotate-1'
                        : 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                  )}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Variant Info */}
      {selectedVariant && (
        <div className="comic-border bg-paper p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-body text-sm text-gray-600">
                Selected: <span className="font-medium">{selectedVariant.title}</span>
              </p>
              <p className="font-body text-lg font-bold text-ink">
                ${parseFloat(selectedVariant.price.amount).toFixed(2)}
              </p>
            </div>
            
            <div className="text-right">
              {selectedVariant.availableForSale ? (
                <span className="inline-block px-3 py-1 bg-neon-lime text-ink text-sm font-body comic-border-sm">
                  IN STOCK
                </span>
              ) : (
                <span className="inline-block px-3 py-1 bg-neon-orange text-ink text-sm font-body comic-border-sm">
                  SOLD OUT
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}