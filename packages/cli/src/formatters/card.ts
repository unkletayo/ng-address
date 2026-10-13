import pc from 'picocolors';
import type { NigerianAddress } from '@ng-address/core';

const CARD_DIVIDER_LENGTH = 45;
const COORDINATE_DECIMAL_PRECISION = 5;

/**
 * Formats a NigerianAddress into a clean terminal card.
 */
export function formatAddressCard(address: NigerianAddress): string {
  const lines: string[] = [];

  lines.push(pc.bold(pc.green('✔ Resolved Nigerian Address')));
  lines.push(pc.dim('─'.repeat(CARD_DIVIDER_LENGTH)));

  if (address.raw) {
    lines.push(`${pc.bold('Address:')}       ${address.raw}`);
  }

  if (address.administrative) {
    const { state, stateCode, lga, ward } = address.administrative;
    lines.push(
      `${pc.bold('State:')}         ${state} ${stateCode ? pc.dim(`(${stateCode})`) : ''}`
    );
    if (lga) {
      lines.push(`${pc.bold('LGA:')}           ${lga}`);
    }
    if (ward) {
      lines.push(`${pc.bold('Ward:')}          ${ward}`);
    }
  }

  if (address.postcode) {
    lines.push(
      `${pc.bold('NDAPS Postcode:')} ${pc.cyan(address.postcode)}`
    );
  }

  if (address.coordinates) {
    const { latitude, longitude, accuracyMeters } = address.coordinates;
    const acc = accuracyMeters ? pc.dim(`(±${accuracyMeters}m)`) : '';
    lines.push(
      `${pc.bold('Coordinates:')}   ${latitude.toFixed(COORDINATE_DECIMAL_PRECISION)}, ${longitude.toFixed(COORDINATE_DECIMAL_PRECISION)} ${acc}`
    );
  }

  if (address.provider) {
    const prov = address.provider.name.toUpperCase();
    const isVerified = address.verification?.status === 'EXACT' || address.verification?.status === 'MATCHED';
    const verified = isVerified ? pc.green(' [VERIFIED]') : '';
    lines.push(`${pc.bold('Provenance:')}    ${prov}${verified}`);
  }

  lines.push(pc.dim('─'.repeat(CARD_DIVIDER_LENGTH)));
  return lines.join('\n');
}

