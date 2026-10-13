import React, { useState, useRef, useId, useCallback, useEffect } from 'react';
import type { NigerianAddress } from '@ng-address/core';
import { useAddressResolution } from '../hooks/useAddressResolution.js';
import { StateLgaSelect, type StateLgaSelection } from './StateLgaSelect.js';
import type { AddressSuggestionItem } from '../types/index.js';

export interface NigerianAddressInputProps {
  /** Initial or controlled query string */
  value?: string;
  /** Callback fired on query text change */
  onChange?: (value: string) => void;
  /** Callback fired when an address is selected */
  onSelect?: (address: NigerianAddress) => void;
  /** Optional placeholder text */
  placeholder?: string;
  /** Optional label text */
  label?: string;
  /** Required field indicator */
  required?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Error message */
  error?: string;
  /** Custom wrapper class name */
  className?: string;
  /** Custom API endpoint */
  proxyUrl?: string;
  /** Debounce milliseconds */
  debounceMs?: number;
  /** Initial mode ('smart' | 'manual') */
  defaultMode?: 'smart' | 'manual';
  /** Custom address resolution function */
  resolveAddress?: (query: string) => Promise<NigerianAddress>;
}

/**
 * Accessible smart search input for Nigerian addresses.
 * Features automatic NDAPS digital postcode detection, WAI-ARIA 1.2 Combobox pattern,
 * live suggestion dropdown, full keyboard navigation (Arrows, Enter, Escape),
 * and manual State/LGA hierarchy selector fallback.
 */
export function NigerianAddressInput({
  value,
  onChange,
  onSelect,
  placeholder = 'Enter Nigerian address or NDAPS digital postcode (e.g. LA-11-W06-TC-10)...',
  label = 'Nigerian Address',
  required = false,
  disabled = false,
  error,
  className = '',
  proxyUrl,
  debounceMs,
  defaultMode = 'smart',
  resolveAddress
}: NigerianAddressInputProps): React.JSX.Element {
  const baseId = useId();
  const inputId = `${baseId}-input`;
  const listboxId = `${baseId}-listbox`;
  const statusId = `${baseId}-status`;
  const errorId = error ? `${baseId}-error` : undefined;

  const [mode, setMode] = useState<'smart' | 'manual'>(defaultMode);
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    query,
    setQuery,
    status,
    suggestions,
    isPostcode,
    error: resolutionError,
    resolve,
    reset
  } = useAddressResolution({
    initialQuery: value,
    proxyUrl,
    debounceMs,
    resolveAddress
  });

  // Sync external value changes
  useEffect(() => {
    if (value !== undefined && value !== query) {
      setQuery(value);
    }
  }, [value, setQuery, query]);

  // Open suggestions dropdown when results arrive
  useEffect(() => {
    if (suggestions.length > 0 && status === 'resolved') {
      setIsOpen(true);
    }
  }, [suggestions, status]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setQuery(text);
    onChange?.(text);
    setFocusedIndex(-1);
    if (!text.trim()) {
      setIsOpen(false);
    }
  };

  const handleSelectSuggestion = useCallback(
    (item: AddressSuggestionItem) => {
      if (item.address) {
        setQuery(item.title);
        onChange?.(item.title);
        onSelect?.(item.address);
      }
      setIsOpen(false);
      setFocusedIndex(-1);
      inputRef.current?.focus();
    },
    [onSelect, onChange, setQuery]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length === 0 || !isOpen) {
      if (e.key === 'ArrowDown' && suggestions.length > 0) {
        e.preventDefault();
        setIsOpen(true);
        setFocusedIndex(0);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
        break;

      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
        break;

      case 'Enter':
        e.preventDefault();
        e.stopPropagation();
        if (focusedIndex >= 0 && suggestions[focusedIndex]) {
          handleSelectSuggestion(suggestions[focusedIndex]!);
        } else {
          resolve();
        }
        break;

      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setFocusedIndex(-1);
        break;

      case 'Tab':
        setIsOpen(false);
        setFocusedIndex(-1);
        break;
    }
  };

  // Close on outside click
  useEffect(() => {
    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };
    window.addEventListener('pointerdown', handlePointerDown);
    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  const handleManualChange = (selection: StateLgaSelection) => {
    const parts = [selection.ward, selection.lga, selection.state].filter(Boolean);
    const combined = parts.join(', ');
    onChange?.(combined);
    if (selection.state && selection.lga) {
      onSelect?.({
        raw: combined,
        administrative: {
          state: selection.state,
          stateCode: selection.stateCode,
          lga: selection.lga,
          ward: selection.ward
        },
        verification: {
          status: 'MATCHED'
        }
      });
    }
  };

  return (
    <div
      ref={containerRef}
      className={`nga-container ${className}`.trim()}
      data-mode={mode}
      data-loading={status === 'loading' ? 'true' : 'false'}
      data-invalid={error || resolutionError ? 'true' : 'false'}
    >
      <div className="nga-header">
        <label htmlFor={inputId} className="nga-label">
          {label}
          {required ? <span className="nga-required" aria-hidden="true"> *</span> : null}
        </label>
        
        {/* Toggle Mode Button */}
        <button
          type="button"
          onClick={() => {
            const nextMode = mode === 'smart' ? 'manual' : 'smart';
            setMode(nextMode);
            setIsOpen(false);
            if (nextMode === 'smart') {
              reset();
            }
          }}
          className="nga-mode-toggle"
          aria-label={mode === 'smart' ? 'Switch to manual State/LGA selection' : 'Switch to smart address search'}
        >
          {mode === 'smart' ? 'Select State & LGA manually' : 'Search by address or postcode'}
        </button>
      </div>

      {mode === 'smart' ? (
        <div className="nga-combobox-wrapper">
          <div className="nga-input-wrapper">
            <input
              ref={inputRef}
              id={inputId}
              type="text"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={isOpen}
              aria-haspopup="listbox"
              aria-controls={listboxId}
              aria-activedescendant={
                focusedIndex >= 0 && suggestions[focusedIndex]
                  ? `${baseId}-option-${focusedIndex}`
                  : undefined
              }
              aria-invalid={Boolean(error || resolutionError)}
              aria-describedby={[statusId, errorId].filter(Boolean).join(' ') || undefined}
              value={query}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              required={required}
              className="nga-input nga-search-input"
            />

            {/* Postcode badge indicator */}
            {isPostcode ? (
              <span className="nga-badge nga-postcode-badge" aria-label="Detected digital postcode">
                NDAPS Postcode
              </span>
            ) : null}

            {/* Loading indicator */}
            {status === 'loading' ? (
              <span className="nga-spinner" aria-hidden="true" />
            ) : null}
          </div>

          {/* Accessible Live Region */}
          <div id={statusId} role="status" aria-live="polite" className="nga-sr-only">
            {status === 'loading'
              ? 'Searching Nigerian addresses...'
              : suggestions.length > 0
              ? `${suggestions.length} address suggestions found. Use arrow keys to navigate.`
              : ''}
          </div>

          {/* Suggestion Dropdown Listbox */}
          {isOpen && suggestions.length > 0 ? (
            <ul
              id={listboxId}
              role="listbox"
              aria-label="Address suggestions"
              className="nga-listbox"
            >
              {suggestions.map((item, idx) => (
                <li
                  key={item.id || idx}
                  id={`${baseId}-option-${idx}`}
                  role="option"
                  aria-selected={focusedIndex === idx}
                  onClick={() => handleSelectSuggestion(item)}
                  className={`nga-option ${focusedIndex === idx ? 'nga-option-focused' : ''}`.trim()}
                >
                  <div className="nga-option-title">{item.title}</div>
                  {item.subtitle ? (
                    <div className="nga-option-subtitle">{item.subtitle}</div>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : (
        <StateLgaSelect
          disabled={disabled}
          required={required}
          includeWard={true}
          onChange={handleManualChange}
        />
      )}

      {error || resolutionError ? (
        <p id={errorId} role="alert" className="nga-error-text">
          {error || resolutionError?.message}
        </p>
      ) : null}
    </div>
  );
}
