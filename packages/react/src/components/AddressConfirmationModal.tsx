import React, { useRef, useId, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { NigerianAddress } from '@ng-address/core';
import { useFocusTrap } from '../hooks/useFocusTrap.js';
import { AddressConfirmationCard, type AddressConfirmationCardProps } from './AddressConfirmationCard.js';

export interface AddressConfirmationModalProps extends Omit<AddressConfirmationCardProps, 'className'> {
  /** Whether the modal is visible */
  isOpen: boolean;
  /** Callback to close modal */
  onClose: () => void;
  /** Optional custom modal wrapper class */
  className?: string;
  /** Close when clicking on backdrop overlay (default: true) */
  closeOnBackdropClick?: boolean;
}

/**
 * Accessible, WCAG 2.2 AA compliant modal dialog for confirming Nigerian address details.
 * Features focus trapping, body scroll lock, Escape key dismissal, and ARIA dialog attributes.
 */
export function AddressConfirmationModal({
  isOpen,
  onClose,
  address,
  onConfirm,
  onEdit,
  className = '',
  closeOnBackdropClick = true,
  title = 'Confirm Address Details',
  description = 'Please verify that your delivery and administrative address details are correct.',
  confirmLabel = 'Confirm Address',
  editLabel = 'Edit Address'
}: AddressConfirmationModalProps): React.JSX.Element | null {
  const baseId = useId();
  const titleId = `${baseId}-title`;
  const descId = `${baseId}-desc`;
  const modalRef = useRef<HTMLDivElement>(null);

  // Focus trap complying with WCAG 2.2 AA
  useFocusTrap(modalRef, {
    isOpen,
    onClose
  });

  // Body scroll lock
  useEffect(() => {
    if (!isOpen || typeof document === 'undefined') return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleConfirm = (confirmed: NigerianAddress) => {
    onConfirm?.(confirmed);
    onClose();
  };

  const handleEdit = () => {
    onEdit?.();
    onClose();
  };

  const modalContent = (
    <div
      className={`nga-modal-backdrop ${className}`.trim()}
      onClick={(e) => {
        if (closeOnBackdropClick && e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        className="nga-modal-dialog"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close confirmation dialog"
          className="nga-modal-close"
        >
          <span aria-hidden="true">&times;</span>
        </button>

        <AddressConfirmationCard
          address={address}
          onConfirm={handleConfirm}
          onEdit={handleEdit}
          title={title}
          description={description}
          confirmLabel={confirmLabel}
          editLabel={editLabel}
        />
      </div>
    </div>
  );

  // Use portal if document.body exists, else inline
  if (typeof document !== 'undefined' && document.body) {
    return createPortal(modalContent, document.body);
  }

  return modalContent;
}
