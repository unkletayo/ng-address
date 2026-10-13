import './setup.js';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { StateLgaSelect } from '../src/index.js';

describe('StateLgaSelect', () => {
  it('renders State and LGA select elements with labels', () => {
    render(<StateLgaSelect />);

    expect(screen.getByLabelText(/State/i)).toBeDefined();
    expect(screen.getByLabelText(/Local Government Area/i)).toBeDefined();
  });

  it('populates LGAs dynamically when a state is selected', () => {
    const handleChange = vi.fn();
    const { rerender } = render(
      <StateLgaSelect state="" lga="" onChange={handleChange} />
    );

    const stateSelect = screen.getByLabelText(/State/i) as HTMLSelectElement;
    fireEvent.change(stateSelect, { target: { value: 'Lagos' } });

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        state: 'Lagos',
        stateCode: 'LA',
        lga: ''
      })
    );

    // Re-render with selected state
    rerender(<StateLgaSelect state="Lagos" lga="" onChange={handleChange} />);

    const lgaSelect = screen.getByLabelText(/Local Government Area/i) as HTMLSelectElement;
    const options = Array.from(lgaSelect.options).map((o) => o.value);

    expect(options).toContain('Ikeja');
    expect(options).toContain('Lagos Island');
    expect(options).toContain('Eti Osa');
  });

  it('renders optional ward field when includeWard is true', () => {
    render(<StateLgaSelect includeWard={true} ward="Ward 1" />);
    expect(screen.getByLabelText(/Ward/i)).toBeDefined();
  });

  it('renders error message and aria-invalid attributes', () => {
    render(<StateLgaSelect error="Please select an LGA" />);
    const alert = screen.getByRole('alert');
    expect(alert.textContent).toBe('Please select an LGA');
    expect(screen.getByLabelText(/State/i).getAttribute('aria-invalid')).toBe('true');
  });
});
