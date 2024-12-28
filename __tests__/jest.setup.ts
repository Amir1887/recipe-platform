global.fetch = jest.fn();

// This mock ensures the Request object is available in your test environment.
// to solve ReferenceError: Request is not defined which occurs because Request is a global object available in the runtime environment of the browser or Node.js (in a specific configuration). 
// However, Jest's test environment (jest-environment-jsdom) doesn't provide this global object directly.
global.Request = jest.fn().mockImplementation((url, options) => {
    return {
      url,
      ...options,
    }
  })
  