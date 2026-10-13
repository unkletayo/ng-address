import './setup.js';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  AddressConfirmationCard,
  AddressConfirmationModal
} from '../src/index.js';
import type { NigerianAddress } from '@ng-address/core';

const mockAddress: NigerianAddress = {
  raw: '45 Awolowo Road, Ikoyi, Lagos',
  street: '45 Awolowo Road',
  postcode: 'LA-11-W06-TC-10',
  administrative: {
    state: 'Lagos',
    stateCode: 'LA',
    lga: 'Eti Osa',
    ward: 'Ikoyi I'
  },
  coordinates: {
    latitude: 6.4474,
    longitude: 3.4219,
    accuracyMeters: 5
  },
  provider: {
    name: 'nipost'
  }
};

describe('AddressConfirmationCard', () => {
  it('renders all address breakdown fields', () => {
    render(<AddressConfirmationCard address={mockAddress} />);

    expect(screen.getByText('45 Awolowo Road, Ikoyi, Lagos')).toBeDefined();
    expect(screen.getByText(/Lagos \(LA\)/i)).toBeDefined();
    expect(screen.getByText('Eti Osa')).toBeDefined();
    expect(screen.getByText('Ikoyi I')).toBeDefined();
    expect(screen.getByText('LA-11-W06-TC-10')).toBeDefined();
    expect(screen.getByText(/6.44740, 3.42190/)).toBeDefined();
    expect(screen.getByText(/NIPOST Verified/i)).toBeDefined();
  });

  it('triggers onConfirm and onEdit callbacks', async () => {
    const handleConfirm = vi.fn();
    const handleEdit = vi.fn();
    const user = userEvent.setup();

    render(
      <AddressConfirmationCard
        address={mockAddress}
        onConfirm={handleConfirm}
        onEdit={handleEdit}
      />
    );

    const confirmBtn = screen.getByRole('button', { name: /Confirm Address/i });
    const editBtn = screen.getByRole('button', { name: /Edit Address/i });

    await user.click(confirmBtn);
    expect(handleConfirm).toHaveBeenCalledWith(mockAddress);

    await user.click(editBtn);
    expect(handleEdit).toHaveBeenCalled();
  });
});

describe('AddressConfirmationModal', () => {
  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <AddressConfirmationModal
        isOpen={false}
        onClose={vi.fn()}
        address={mockAddress}
      />
    );

    expect(container.querySelector('[role="dialog"]')).toBeNull();
  });

  it('renders accessible dialog with title and close button when isOpen is true', async () => {
    const handleClose = vi.fn();
    const user = userEvent.setup();

    render(
      <AddressConfirmationModal
        isOpen={true}
        onClose={handleClose}
        address={mockAddress}
      />
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeDefined();
    expect(dialog.getAttribute('aria-modal')).toBe('true');

    const closeBtn = screen.getByRole('button', { name: /Close confirmation dialog/i });
    await user.click(closeBtn);
    expect(handleClose).toHaveBeenCalled();
  });
});
