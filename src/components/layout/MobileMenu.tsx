import { useState, useEffect } from 'react';
import { cx } from '../../utils/classes';

interface MobileMenuProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function MobileMenu({ isOpen, onToggle }: MobileMenuProps) {
  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onToggle();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onToggle]);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const menuItems = [
    { label: 'Shop', href: '/shop' },
    { label: 'Contact', href: '/contact' },
    { label: 'Discord', href: '#', external: true },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        aria-label="Toggle navigation menu"
        className={cx(
          'md:hidden flex flex-col justify-center items-center w-8 h-8',
          'space-y-1 transition-all duration-300 ease-out',
          'comic-border-sm bg-electric-blue hover:bg-electric-blue-dark p-1'
        )}
      >
        <span
          className={cx(
            'block w-5 h-0.5 bg-ink transition-all duration-300',
            isOpen && 'rotate-45 translate-y-1.5'
          )}
        />
        <span
          className={cx(
            'block w-5 h-0.5 bg-ink transition-all duration-300',
            isOpen && 'opacity-0'
          )}
        />
        <span
          className={cx(
            'block w-5 h-0.5 bg-ink transition-all duration-300',
            isOpen && '-rotate-45 -translate-y-1.5'
          )}
        />
      </button>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-ink bg-opacity-90 z-40 md:hidden"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={cx(
          'fixed top-0 right-0 h-full w-64 bg-paper z-50',
          'transform transition-transform duration-300 ease-out md:hidden',
          'comic-border shadow-2xl',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Close button */}
          <div className="flex justify-end p-4">
            <button
              onClick={onToggle}
              aria-label="Close navigation menu"
              className="w-8 h-8 flex items-center justify-center comic-border-sm bg-neon-orange hover:bg-neon-orange-dark text-ink font-bold text-xl"
            >
              ×
            </button>
          </div>

          {/* Menu items */}
          <nav className="flex-1 px-4">
            <ul className="space-y-4">
              {menuItems.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    onClick={() => !item.external && onToggle()}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noopener noreferrer' : undefined}
                    className={cx(
                      'block px-4 py-3 text-xl font-display text-ink',
                      'comic-border bg-neon-lime hover:bg-neon-lime-dark',
                      'transition-all duration-200 hover:rotate-1 hover:scale-105',
                      'focus:outline-none focus:ring-2 focus:ring-electric-blue'
                    )}
                  >
                    {item.label}
                    {item.external && (
                      <span className="ml-2 text-sm" aria-hidden="true">↗</span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t-2 border-ink">
            <p className="text-sm text-ink text-center font-body">
              Underground MTG Art
            </p>
          </div>
        </div>
      </div>
    </>
  );
}