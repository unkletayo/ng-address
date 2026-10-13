import { useEffect } from 'react';
import { useLatest } from './useLatest.js';

export interface UseFocusTrapOptions {
  isOpen: boolean;
  onClose?: () => void;
  returnFocus?: boolean;
}

const FOCUSABLE_SELECTOR = [
  'button:not([disabled])',
  '[href]:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"]):not([disabled])'
].join(', ');

/**
 * Accessible, lightweight focus-trap hook complying with WCAG 2.2 AA and ARIA Modal Dialog guidelines.
 * Traps Tab / Shift+Tab cycling within element, handles Escape dismiss, and returns focus on close.
 */
export function useFocusTrap(
  containerRef: React.RefObject<HTMLElement | null>,
  options: UseFocusTrapOptions
): void {
  const optionsRef = useLatest(options);

  useEffect(() => {
    if (!options.isOpen || !containerRef.current) {
      return;
    }

    const container = containerRef.current;
    const previousActiveElement = document.activeElement as HTMLElement | null;

    // Focus first focusable element
    const focusableElements = Array.from(
      container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
    );

    if (focusableElements.length > 0) {
      const first = focusableElements[0];
      first?.focus();
    } else {
      container.setAttribute('tabindex', '-1');
      container.focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        optionsRef.current.onClose?.();
        return;
      }

      if (e.key === 'Tab') {
        const elements = Array.from(
          container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
        );
        if (elements.length === 0) {
          e.preventDefault();
          return;
        }

        const first = elements[0];
        const last = elements[elements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first || !container.contains(document.activeElement)) {
            e.preventDefault();
            last?.focus();
          }
        } else {
          if (document.activeElement === last || !container.contains(document.activeElement)) {
            e.preventDefault();
            first?.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (optionsRef.current.returnFocus !== false && previousActiveElement && typeof previousActiveElement.focus === 'function') {
        previousActiveElement.focus();
      }
    };
  }, [options.isOpen, containerRef, optionsRef]);
}
