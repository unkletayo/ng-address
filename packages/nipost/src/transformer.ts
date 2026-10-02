import {
  findMatchingLga,
  findNigerianState,
  type AdministrativeInfo,
  type AddressProvenance,
  type BuildingInfo,
  type Coordinates,
  type NigerianAddress,
  type VerificationInfo
} from '@ng-address/core';

export interface NipostLookupAdministrativeAddress {
  state_name?: string;
  lga_name?: string;
  locality_name?: string;
  zone?: string;
}

export interface NipostLookupRecentHouseAddress {
  recent?: string;
}

export interface NipostLookupData {
  postcode: string;
  valid: boolean;
  administrative_address?: NipostLookupAdministrativeAddress;
  recent_house_address?: NipostLookupRecentHouseAddress;
  building_use_status?: string;
  other_building_info?: Record<string, unknown>;
  point_geometry?: {
    type?: string;
    coordinates?: [number, number]; // [lng, lat]
  };
}

export interface NipostReverseUnit {
  postcode: string;
  display?: string;
  distance_m?: number;
  confidence?: 'high' | 'medium' | 'low';
  state_name?: string;
  lga_name?: string;
  locality_name?: string;
  address?: string;
}

export interface NipostReverseData {
  found: boolean;
  coordinate?: [number, number]; // [lng, lat]
  unit?: NipostReverseUnit;
  area?: string;
  district?: string;
  state?: string;
  message?: string;
  radius_m?: number;
}

/**
 * Transforms official NIPOST GET /v1/lookup response payload into canonical NigerianAddress.
 */
export function transformLookupResponse(
  data: NipostLookupData,
  rawCode?: string
): NigerianAddress {
  const timestamp = new Date().toISOString();
  const admin = data.administrative_address;
  const recent = data.recent_house_address;
  const postcode = data.postcode || rawCode;

  // Canonical state resolution
  let stateName = admin?.state_name;
  let stateCode: string | undefined;
  if (stateName) {
    const matchedState = findNigerianState(stateName);
    if (matchedState) {
      stateName = matchedState.name;
      stateCode = matchedState.code;
    }
  }

  // Canonical LGA resolution
  let lgaName = admin?.lga_name;
  if (lgaName && stateName) {
    const matchedLga = findMatchingLga(lgaName, stateName);
    if (matchedLga) {
      lgaName = matchedLga;
    }
  }

  // Street address
  const street = recent?.recent;

  // Raw text string
  const addressParts = [street, lgaName, stateName, postcode].filter(Boolean);
  const raw = addressParts.join(', ');

  // Coordinates if point_geometry present
  let coordinates: Coordinates | undefined;
  if (data.point_geometry?.coordinates && Array.isArray(data.point_geometry.coordinates)) {
    const [lng, lat] = data.point_geometry.coordinates;
    if (typeof lat === 'number' && typeof lng === 'number') {
      coordinates = {
        latitude: lat,
        longitude: lng,
        accuracyMeters: 5
      };
    }
  }

  // Building metadata
  const building: BuildingInfo | undefined = data.building_use_status
    ? {
        name: data.building_use_status
      }
    : undefined;

  // Administrative components
  const administrative: AdministrativeInfo = {
    state: stateName,
    stateCode,
    lga: lgaName,
    ward: admin?.locality_name
  };

  // Provenance tracking
  const provenance: AddressProvenance = {
    raw: { source: 'nipost', retrievedAt: timestamp },
    state: stateName ? { source: 'nipost', retrievedAt: timestamp } : undefined,
    lga: lgaName ? { source: 'nipost', retrievedAt: timestamp } : undefined,
    postcode: postcode ? { source: 'nipost', retrievedAt: timestamp } : undefined,
    street: street ? { source: 'nipost', retrievedAt: timestamp } : undefined,
    coordinates: coordinates ? { source: 'nipost', retrievedAt: timestamp } : undefined
  };

  const verification: VerificationInfo = {
    status: data.valid ? 'EXACT' : 'UNRESOLVED',
    method: 'nipost_lookup',
    verifiedAt: timestamp
  };

  return {
    raw,
    administrative,
    street,
    building,
    postcode,
    coordinates,
    provider: {
      name: 'nipost',
      reference: postcode,
      rawResponse: data as unknown as Record<string, unknown>
    },
    provenance,
    verification
  };
}

/**
 * Transforms official NIPOST GET /v1/search/reverse response payload into canonical NigerianAddress.
 */
export function transformReverseResponse(data: NipostReverseData): NigerianAddress | null {
  if (!data.found || !data.unit) {
    return null;
  }

  const timestamp = new Date().toISOString();
  const unit = data.unit;
  let stateName = unit.state_name || data.state;
  let stateCode: string | undefined;

  if (stateName) {
    const matchedState = findNigerianState(stateName);
    if (matchedState) {
      stateName = matchedState.name;
      stateCode = matchedState.code;
    }
  }

  let lgaName = unit.lga_name;
  if (lgaName && stateName) {
    const matchedLga = findMatchingLga(lgaName, stateName);
    if (matchedLga) {
      lgaName = matchedLga;
    }
  }

  const street = unit.address;
  const postcode = unit.postcode;

  const addressParts = [street, lgaName, stateName, postcode].filter(Boolean);
  const raw = addressParts.join(', ');

  let coordinates: Coordinates | undefined;
  if (data.coordinate && Array.isArray(data.coordinate)) {
    const [lng, lat] = data.coordinate;
    if (typeof lat === 'number' && typeof lng === 'number') {
      coordinates = {
        latitude: lat,
        longitude: lng,
        accuracyMeters: unit.distance_m ?? data.radius_m
      };
    }
  }

  const administrative: AdministrativeInfo = {
    state: stateName,
    stateCode,
    lga: lgaName,
    ward: unit.locality_name
  };

  const provenance: AddressProvenance = {
    raw: { source: 'nipost', retrievedAt: timestamp },
    state: stateName ? { source: 'nipost', retrievedAt: timestamp } : undefined,
    lga: lgaName ? { source: 'nipost', retrievedAt: timestamp } : undefined,
    postcode: postcode ? { source: 'nipost', retrievedAt: timestamp } : undefined,
    street: street ? { source: 'nipost', retrievedAt: timestamp } : undefined,
    coordinates: coordinates ? { source: 'nipost', retrievedAt: timestamp } : undefined
  };

  const verification: VerificationInfo = {
    status: 'EXACT',
    method: 'nipost_reverse_geocode',
    verifiedAt: timestamp
  };

  return {
    raw,
    administrative,
    street,
    postcode,
    coordinates,
    provider: {
      name: 'nipost',
      reference: postcode,
      rawResponse: data as unknown as Record<string, unknown>
    },
    provenance,
    verification
  };
}
