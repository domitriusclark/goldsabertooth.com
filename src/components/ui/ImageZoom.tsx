import { useState, useEffect, useRef } from 'react';
import { cx } from '../../utils/classes';
import type { ProductImage } from '../../lib/types';

interface ImageZoomProps {
  image: ProductImage;
  isOpen: boolean;
  onClose: () => void;
}

export default function ImageZoom({ image, isOpen, onClose }: ImageZoomProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
      document.body.style.overflow = 'hidden';
    } else {
      dialog.close();
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const isInDialog = (
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom
    );
    
    if (!isInDialog) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Product image zoom"
      className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4 backdrop:bg-black backdrop:bg-opacity-90"
      onClick={handleBackdropClick}
    >
      <div className="relative max-w-4xl max-h-full flex items-center justify-center">
        {/* Close button */}
        <button
          onClick={onClose}
          className={cx(
            'absolute top-4 right-4 z-10',
            'w-10 h-10 flex items-center justify-center',
            'comic-border bg-neon-orange hover:bg-neon-orange-dark text-ink',
            'font-bold text-xl transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-electric-blue',
            'hover:rotate-6 hover:scale-110'
          )}
          aria-label="Close image zoom"
        >
          ×
        </button>

        {/* Image */}
        <img
          src={image.url}
          alt={image.altText || 'Product image'}
          className={cx(
            'max-w-full max-h-full object-contain',
            'comic-border shadow-2xl bg-paper'
          )}
          onClick={(e) => e.stopPropagation()}
        />

        {/* Image info */}
        {image.altText && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="comic-border bg-paper p-3 max-w-md">
              <p className="font-body text-sm text-ink">
                {image.altText}
              </p>
            </div>
          </div>
        )}
      </div>
    </dialog>
  );
}