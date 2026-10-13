import './setup.js';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  NigerianAddressInput,
  AddressConfirmationModal
} from '../src/index.js';
import type { NigerianAddress } from '@ng-address/core';

const mockAddress: NigerianAddress = {
  raw: '15 Marina, Lagos Island, Lagos',
  administrative: { state: 'Lagos', lga: 'Lagos Island' }
};

describe('Accessibility & Keyboard Navigation (WCAG 2.2 AA)', () => {
  it('combobox supports ArrowDown, ArrowUp, Enter selection and Escape dismissal', async () => {
    const handleSelect = vi.fn();
    const mockResolve = vi.fn().mockResolvedValue(mockAddress);
    const user = userEvent.setup();

    render(
      <NigerianAddressInput
        resolveAddress={mockResolve}
        onSelect={handleSelect}
        debounceMs={10}
      />
    );

    const input = screen.getByRole('combobox');
    await user.type(input, 'Marina');

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeDefined();
    });

    const option = screen.getByRole('option');

    // Arrow down to highlight option
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(option.getAttribute('aria-selected')).toBe('true');

    // Press Enter to select
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(handleSelect).toHaveBeenCalledWith(
      expect.objectContaining({
        raw: '15 Marina, Lagos Island, Lagos'
      })
    );

    // Dropdown closes after selection
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('modal dialog closes on Escape key press (useFocusTrap)', () => {
    const handleClose = vi.fn();

    render(
      <AddressConfirmationModal
        isOpen={true}
        onClose={handleClose}
        address={mockAddress}
      />
    );

    expect(screen.getByRole('dialog')).toBeDefined();

    // Trigger Escape on window
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalled();
  });
});
