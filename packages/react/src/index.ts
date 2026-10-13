// Context & Provider
export {
  AddressConfigProvider,
  useAddressConfig,
  type AddressConfigProviderProps
} from './context/AddressConfigContext.js';

// Headless Hooks
export { useAddressResolution } from './hooks/useAddressResolution.js';
export { usePostcodeLookup } from './hooks/usePostcodeLookup.js';
export { useFocusTrap, type UseFocusTrapOptions } from './hooks/useFocusTrap.js';
export { useLatest } from './hooks/useLatest.js';

// UI Components
export {
  NigerianAddressInput,
  type NigerianAddressInputProps
} from './components/NigerianAddressInput.js';

export {
  StateLgaSelect,
  type StateLgaSelectProps,
  type StateLgaSelection
} from './components/StateLgaSelect.js';

export {
  AddressConfirmationCard,
  type AddressConfirmationCardProps
} from './components/AddressConfirmationCard.js';

export {
  AddressConfirmationModal,
  type AddressConfirmationModalProps
} from './components/AddressConfirmationModal.js';

// Types
export type {
  AddressConfig,
  AddressResolutionStatus,
  AddressResolutionResult,
  AddressSuggestionItem,
  UseAddressResolutionOptions,
  UseAddressResolutionReturn,
  UsePostcodeLookupOptions,
  UsePostcodeLookupReturn
} from './types/index.js';
