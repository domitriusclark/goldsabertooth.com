import { useState, useEffect } from 'react';
import { cx } from '../../utils/classes';

interface FilterBarProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

const categories = [
  'Playmats',
  'Stickers', 
  'Tokens',
  'Apparel'
];

export default function FilterBar({ selectedTags, onTagsChange }: FilterBarProps) {
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    setCurrentUrl(window.location.search);
  }, []);

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    
    onTagsChange(newTags);
    
    // Update URL
    const url = new URL(window.location.href);
    if (newTags.length > 0) {
      url.searchParams.set('tag', newTags.join(','));
    } else {
      url.searchParams.delete('tag');
    }
    
    window.history.pushState({}, '', url.toString());
  };

  const clearAllFilters = () => {
    onTagsChange([]);
    const url = new URL(window.location.href);
    url.searchParams.delete('tag');
    window.history.pushState({}, '', url.toString());
  };

  return (
    <div className="bg-ink p-6 comic-border mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="font-display text-2xl text-electric-blue outline-text rotate-1">
          FILTER THE CHAOS
        </h2>
        
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const isSelected = selectedTags.includes(category);
            return (
              <button
                key={category}
                onClick={() => handleTagToggle(category)}
                aria-pressed={isSelected}
                className={cx(
                  'px-4 py-2 font-display text-sm transition-all duration-200',
                  'comic-border-sm btn-psychedelic',
                  'focus:outline-none focus:ring-2 focus:ring-electric-blue',
                  isSelected
                    ? 'bg-neon-lime text-ink scale-105 rotate-1'
                    : 'bg-paper text-ink hover:bg-neon-lime hover:rotate-1 hover:scale-105'
                )}
              >
                {category.toUpperCase()}
              </button>
            );
          })}
          
          {selectedTags.length > 0 && (
            <button
              onClick={clearAllFilters}
              className={cx(
                'px-4 py-2 font-display text-sm transition-all duration-200',
                'comic-border-sm bg-neon-orange hover:bg-neon-orange-dark text-ink',
                'btn-psychedelic focus:outline-none focus:ring-2 focus:ring-electric-blue'
              )}
            >
              CLEAR ALL
            </button>
          )}
        </div>
      </div>
      
      {selectedTags.length > 0 && (
        <div className="mt-4 text-sm text-paper font-body">
          Showing: <span className="text-electric-blue">{selectedTags.join(', ')}</span>
        </div>
      )}
    </div>
  );
}