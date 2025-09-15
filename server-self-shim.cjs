// CommonJS shim preloaded via `node -r` to ensure `self` exists in Node before Next's runtime loads.
if (typeof globalThis !== 'undefined' && typeof globalThis.self === 'undefined') {
  Object.defineProperty(globalThis, 'self', {
    configurable: true,
    enumerable: false,
    writable: true,
    value: globalThis,
  });
}

// Robust monkeypatch: when Node requires a chunk file from the server runtime that fails or doesn't export
// a chunk-like object, return a safe fallback or attempt to derive the chunk from the global webpack array.
try {
  const Module = require('module');
  const originalLoad = Module._load;
  Module._load = function(request, parent, isMain) {
    try {
      const isChunkRequest = typeof request === 'string' && request.indexOf('chunks') !== -1;
      if (isChunkRequest) {
        try {
          const res = originalLoad.apply(this, arguments);
          if (res && typeof res === 'object') return res;
          // Try to derive chunk from global webpack array
          try{
            if (globalThis && globalThis.self && Array.isArray(globalThis.self.webpackChunk_N_E)){
              const arr = globalThis.self.webpackChunk_N_E;
              const last = arr[arr.length-1];
              if(last) return Array.isArray(last)?{ids:last[0],modules:last[1],runtime:last[2]}:last;
            }
          }catch(_e){}
          return { modules: {}, ids: [], runtime: function(){} };
        } catch (err) {
          try{
            if (globalThis && globalThis.self && Array.isArray(globalThis.self.webpackChunk_N_E)){
              const arr = globalThis.self.webpackChunk_N_E;
              const last = arr[arr.length-1];
              if(last) return Array.isArray(last)?{ids:last[0],modules:last[1],runtime:last[2]}:last;
            }
          }catch(_e){}
          return { modules: {}, ids: [], runtime: function(){} };
        }
      }
    } catch (_e) {}
    return originalLoad.apply(this, arguments);
  };
} catch (_err) {}
