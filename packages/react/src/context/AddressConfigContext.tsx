import React, { createContext, useContext, useMemo } from 'react';
import type { AddressConfig } from '../types/index.js';

const defaultContextValue: AddressConfig = {
  proxyUrl: '/api/address/resolve',
  debounceMs: 300
};

export const AddressConfigContext = createContext<AddressConfig>(defaultContextValue);

export interface AddressConfigProviderProps {
  config?: AddressConfig;
  children: React.ReactNode;
}

/**
 * Global React Context Provider for configuring backend proxy routes and default behavior.
 */
export function AddressConfigProvider({
  config = {},
  children
}: AddressConfigProviderProps): React.JSX.Element {
  const mergedConfig = useMemo<AddressConfig>(
    () => ({
      ...defaultContextValue,
      ...config
    }),
    [config]
  );

  return (
    <AddressConfigContext.Provider value={mergedConfig}>
      {children}
    </AddressConfigContext.Provider>
  );
}

/**
 * Hook to access current address configuration.
 */
export function useAddressConfig(): AddressConfig {
  return useContext(AddressConfigContext);
}
