import '@testing-library/jest-dom';

// Node ortamında fetch, Request, Response gibi Web API özellikleri eksik olabilir
if (typeof globalThis.Request === 'undefined') {
    const { Request, Response, Headers } = require('node-fetch');
    globalThis.Request = Request;
    globalThis.Response = Response;
    globalThis.Headers = Headers;
}

// Bazı kütüphaneler window function'larına ihtiyaç duyabilir, mock setuplarını burada yapabiliriz.
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});
