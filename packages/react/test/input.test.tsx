import './setup.js';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NigerianAddressInput } from '../src/index.js';

describe('NigerianAddressInput', () => {
  it('renders input with combobox role and default placeholder', () => {
    render(<NigerianAddressInput />);
    const input = screen.getByRole('combobox');
    expect(input).toBeDefined();
    expect(input.getAttribute('aria-expanded')).toBe('false');
  });

  it('displays NDAPS postcode badge when digital postcode is typed', async () => {
    const user = userEvent.setup();
    render(<NigerianAddressInput />);

    const input = screen.getByRole('combobox');
    await user.type(input, 'LA-11-W06-TC-10');

    expect(screen.getByText(/NDAPS Postcode/i)).toBeDefined();
  });

  it('switches to manual mode on toggle button click', async () => {
    const user = userEvent.setup();
    render(<NigerianAddressInput />);

    expect(screen.getByRole('combobox')).toBeDefined();

    const toggleBtn = screen.getByRole('button', { name: /Switch to manual State\/LGA selection/i });
    await user.click(toggleBtn);

    expect(screen.queryByPlaceholderText(/Enter Nigerian address or NDAPS postcode/i)).toBeNull();
    expect(screen.getByLabelText(/State/i)).toBeDefined();
    expect(screen.getByLabelText(/Local Government Area/i)).toBeDefined();
  });

  it('selects suggestion on click and triggers onSelect callback', async () => {
    const handleSelect = vi.fn();
    const mockResolve = vi.fn().mockResolvedValue({
      raw: 'Plot 10 Admiralty Way, Lekki Phase 1, Lagos',
      postcode: 'LA-10-A01-LK-02',
      administrative: { state: 'Lagos', lga: 'Eti Osa' }
    });

    const user = userEvent.setup();
    render(
      <NigerianAddressInput
        resolveAddress={mockResolve}
        onSelect={handleSelect}
        debounceMs={10}
      />
    );

    const input = screen.getByRole('combobox');
    await user.type(input, 'Admiralty');

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeDefined();
    });

    const option = screen.getByRole('option');
    await user.click(option);

    expect(handleSelect).toHaveBeenCalledWith(
      expect.objectContaining({
        raw: 'Plot 10 Admiralty Way, Lekki Phase 1, Lagos'
      })
    );
  });
});
