import { NextResponse } from 'next/server';
import { NipostProvider } from '@ng-address/nipost';
import { isValidPostcodeFormat, AddressError } from '@ng-address/core';

// Server-side provider initialized with protected environment secret.
// Created lazily so a missing key surfaces as a clear 500 instead of a fake credential.
let provider: NipostProvider | undefined;

function getProvider(): NipostProvider | null {
  const apiKey = process.env.NIPOST_API_KEY;
  if (!apiKey) {
    return null;
  }
  provider ??= new NipostProvider({ apiKey });
  return provider;
}

export async function POST(request: Request) {
  const nipost = getProvider();
  if (!nipost) {
    return NextResponse.json(
      { success: false, error: 'NIPOST_API_KEY is not configured on the server' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { postcode } = body;

    if (!postcode || typeof postcode !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Postcode parameter is required' },
        { status: 400 }
      );
    }

    if (!isValidPostcodeFormat(postcode)) {
      return NextResponse.json(
        { success: false, error: 'Invalid Nigerian postcode format' },
        { status: 400 }
      );
    }

    const resolution = await nipost.resolvePostcode(postcode);

    return NextResponse.json({
      success: true,
      data: resolution
    });
  } catch (error: unknown) {
    if (error instanceof AddressError) {
      const status = error.code === 'NOT_FOUND' ? 404 : 400;
      return NextResponse.json(
        { success: false, code: error.code, error: error.message },
        { status }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to resolve address' },
      { status: 500 }
    );
  }
}
