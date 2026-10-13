import React from 'react';
import type { NigerianAddress } from '@ng-address/core';

export interface AddressConfirmationCardProps {
  /** Resolved Nigerian address to display */
  address: NigerianAddress;
  /** Callback when user clicks Confirm */
  onConfirm?: (address: NigerianAddress) => void;
  /** Callback when user clicks Edit / Change */
  onEdit?: () => void;
  /** Custom container class */
  className?: string;
  /** Title header text */
  title?: string;
  /** Subtitle description text */
  description?: string;
  /** Confirm button label */
  confirmLabel?: string;
  /** Edit button label */
  editLabel?: string;
}

/**
 * Visual address confirmation card displaying resolved administrative hierarchy,
 * postcode, coordinates, and provenance indicators for user verification.
 */
export function AddressConfirmationCard({
  address,
  onConfirm,
  onEdit,
  className = '',
  title = 'Confirm Address Details',
  description = 'Please verify that your delivery and administrative address details are correct.',
  confirmLabel = 'Confirm Address',
  editLabel = 'Edit Address'
}: AddressConfirmationCardProps): React.JSX.Element {
  const admin = address.administrative;
  const coords = address.coordinates;
  const provenance = address.provenance;
  const isNipost = address.provider?.name === 'nipost' || provenance?.raw?.source === 'nipost';

  return (
    <div className={`nga-card ${className}`.trim()}>
      <div className="nga-card-header">
        <div className="nga-card-title-group">
          <h3 className="nga-card-title">{title}</h3>
          {description ? (
            <p className="nga-card-description">{description}</p>
          ) : null}
        </div>
        {isNipost ? (
          <span className="nga-badge nga-badge-verified" title="Authoritative NIPOST NDAPS verification">
            NIPOST Verified
          </span>
        ) : null}
      </div>

      <div className="nga-card-body">
        {/* Full Formatted Address */}
        {address.raw ? (
          <div className="nga-row">
            <span className="nga-meta-label">Full Address</span>
            <span className="nga-meta-value nga-font-bold">{address.raw}</span>
          </div>
        ) : null}

        {/* State and LGA */}
        <div className="nga-grid-2">
          <div className="nga-row">
            <span className="nga-meta-label">State</span>
            <span className="nga-meta-value">
              {admin.state || '—'} {admin.stateCode ? `(${admin.stateCode})` : ''}
            </span>
          </div>
          <div className="nga-row">
            <span className="nga-meta-label">LGA</span>
            <span className="nga-meta-value">{admin.lga || '—'}</span>
          </div>
        </div>

        {/* Ward and Street */}
        <div className="nga-grid-2">
          {admin.ward ? (
            <div className="nga-row">
              <span className="nga-meta-label">Ward / Locality</span>
              <span className="nga-meta-value">{admin.ward}</span>
            </div>
          ) : null}
          {address.street ? (
            <div className="nga-row">
              <span className="nga-meta-label">Street</span>
              <span className="nga-meta-value">{address.street}</span>
            </div>
          ) : null}
        </div>

        {/* Postcode and Coordinates */}
        <div className="nga-grid-2">
          {address.postcode ? (
            <div className="nga-row">
              <span className="nga-meta-label">NDAPS Postcode</span>
              <span className="nga-meta-value nga-code-badge">{address.postcode}</span>
            </div>
          ) : null}
          {coords ? (
            <div className="nga-row">
              <span className="nga-meta-label">Coordinates</span>
              <span className="nga-meta-value nga-coords">
                {coords.latitude.toFixed(5)}, {coords.longitude.toFixed(5)}
                {coords.accuracyMeters ? (
                  <span className="nga-accuracy"> (±{Math.round(coords.accuracyMeters)}m)</span>
                ) : null}
              </span>
            </div>
          ) : null}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="nga-card-actions">
        {onEdit ? (
          <button
            type="button"
            onClick={onEdit}
            className="nga-button nga-button-secondary"
          >
            {editLabel}
          </button>
        ) : null}
        {onConfirm ? (
          <button
            type="button"
            onClick={() => onConfirm(address)}
            className="nga-button nga-button-primary"
          >
            {confirmLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}
