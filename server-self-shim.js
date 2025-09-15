// Server shim to ensure `self` is available in Node server bundles
if (typeof globalThis !== 'undefined' && typeof globalThis.self === 'undefined') {
  Object.defineProperty(globalThis, 'self', {
    configurable: true,
    enumerable: false,
    writable: true,
    value: globalThis,
  })
}
