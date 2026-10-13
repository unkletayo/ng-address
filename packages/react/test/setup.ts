import { Window as HappyWindow } from 'happy-dom';

const win = new HappyWindow({ url: 'http://localhost' });
Object.defineProperty(globalThis, 'window', { value: win, configurable: true, writable: true });
Object.defineProperty(globalThis, 'document', { value: win.document, configurable: true, writable: true });
Object.defineProperty(globalThis, 'navigator', { value: win.navigator, configurable: true, writable: true });
Object.defineProperty(globalThis, 'HTMLElement', { value: win.HTMLElement, configurable: true, writable: true });
Object.defineProperty(globalThis, 'Element', { value: win.Element, configurable: true, writable: true });
Object.defineProperty(globalThis, 'Node', { value: win.Node, configurable: true, writable: true });
Object.defineProperty(globalThis, 'customElements', { value: win.customElements, configurable: true, writable: true });
globalThis.requestAnimationFrame = (callback: FrameRequestCallback) =>
  setTimeout(callback, 0) as unknown as number;
globalThis.cancelAnimationFrame = (id: number) => clearTimeout(id);
