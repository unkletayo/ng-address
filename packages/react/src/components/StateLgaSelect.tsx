import React, { useId, useMemo, useCallback } from 'react';
import { NIGERIAN_STATES, findNigerianState } from '@ng-address/core';

export interface StateLgaSelection {
  state?: string;
  stateCode?: string;
  lga?: string;
  ward?: string;
}

export interface StateLgaSelectProps {
  /** Selected state name or code */
  state?: string;
  /** Selected LGA name */
  lga?: string;
  /** Optional Ward name */
  ward?: string;
  /** Callback fired whenever selection changes */
  onChange?: (selection: StateLgaSelection) => void;
  /** Optional container class name */
  className?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Custom state field label */
  stateLabel?: string;
  /** Custom LGA field label */
  lgaLabel?: string;
  /** Custom Ward field label */
  wardLabel?: string;
  /** Render optional ward text field */
  includeWard?: boolean;
  /** Required validation indicator */
  required?: boolean;
  /** Error message string */
  error?: string;
}

/**
 * Accessible, cascading State and LGA selector component for Nigerian addresses.
 * Uses authoritative offline datasets from `@ng-address/core` with zero network latency.
 */
export function StateLgaSelect({
  state = '',
  lga = '',
  ward = '',
  onChange,
  className = '',
  disabled = false,
  stateLabel = 'State',
  lgaLabel = 'Local Government Area (LGA)',
  wardLabel = 'Ward / Locality',
  includeWard = false,
  required = false,
  error
}: StateLgaSelectProps): React.JSX.Element {
  const baseId = useId();
  const stateSelectId = `${baseId}-state`;
  const lgaSelectId = `${baseId}-lga`;
  const wardInputId = `${baseId}-ward`;
  const errorId = error ? `${baseId}-error` : undefined;

  // Derive available LGAs directly during render without unnecessary useEffect sync
  const matchedStateData = useMemo(() => {
    return state ? findNigerianState(state) : undefined;
  }, [state]);

  const lgaOptions = useMemo(() => {
    return matchedStateData?.lgas ?? [];
  }, [matchedStateData]);

  const handleStateChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedName = e.target.value;
      const matched = selectedName ? findNigerianState(selectedName) : undefined;
      onChange?.({
        state: matched?.name ?? selectedName,
        stateCode: matched?.code,
        lga: '', // Reset LGA on state change
        ward
      });
    },
    [onChange, ward]
  );

  const handleLgaChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange?.({
        state: matchedStateData?.name ?? state,
        stateCode: matchedStateData?.code,
        lga: e.target.value,
        ward
      });
    },
    [onChange, matchedStateData, state, ward]
  );

  const handleWardChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.({
        state: matchedStateData?.name ?? state,
        stateCode: matchedStateData?.code,
        lga,
        ward: e.target.value
      });
    },
    [onChange, matchedStateData, state, lga]
  );

  return (
    <div
      className={`nga-cascade ${className}`.trim()}
      data-disabled={disabled ? 'true' : 'false'}
      data-invalid={error ? 'true' : 'false'}
    >
      {/* State Select */}
      <div className="nga-field">
        <label htmlFor={stateSelectId} className="nga-label">
          {stateLabel}
          {required ? <span className="nga-required" aria-hidden="true"> *</span> : null}
        </label>
        <select
          id={stateSelectId}
          name="state"
          value={matchedStateData?.name ?? state}
          onChange={handleStateChange}
          disabled={disabled}
          required={required}
          aria-required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          className="nga-select"
        >
          <option value="">Select State</option>
          {NIGERIAN_STATES.map((s) => (
            <option key={s.code} value={s.name}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* LGA Select */}
      <div className="nga-field">
        <label htmlFor={lgaSelectId} className="nga-label">
          {lgaLabel}
          {required ? <span className="nga-required" aria-hidden="true"> *</span> : null}
        </label>
        <select
          id={lgaSelectId}
          name="lga"
          value={lga}
          onChange={handleLgaChange}
          disabled={disabled || !matchedStateData}
          required={required}
          aria-required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          className="nga-select"
        >
          <option value="">
            {matchedStateData ? 'Select LGA' : 'Select a State first'}
          </option>
          {lgaOptions.map((lgaName) => (
            <option key={lgaName} value={lgaName}>
              {lgaName}
            </option>
          ))}
        </select>
      </div>

      {/* Optional Ward Input */}
      {includeWard ? (
        <div className="nga-field">
          <label htmlFor={wardInputId} className="nga-label">
            {wardLabel}
          </label>
          <input
            id={wardInputId}
            type="text"
            name="ward"
            value={ward}
            onChange={handleWardChange}
            disabled={disabled}
            placeholder="e.g. Ward 3 / Victoria Island"
            className="nga-input"
          />
        </div>
      ) : null}

      {error ? (
        <p id={errorId} role="alert" className="nga-error-text">
          {error}
        </p>
      ) : null}
    </div>
  );
}
