// Test setup file for vitest
import { vi } from 'vitest';

// Mock requestAnimationFrame for testing
global.requestAnimationFrame = vi.fn().mockImplementation((cb) => {
  return setTimeout(cb, 16);
});

global.cancelAnimationFrame = vi.fn().mockImplementation((id) => {
  clearTimeout(id);
});

// Mock window properties that might not exist in jsdom
Object.defineProperty(window, 'pageYOffset', {
  value: 0,
  writable: true,
});

Object.defineProperty(window, 'innerHeight', {
  value: 1024,
  writable: true,
});

// Mock document properties
Object.defineProperty(document.documentElement, 'clientHeight', {
  value: 1024,
  writable: true,
});

Object.defineProperty(document.documentElement, 'scrollHeight', {
  value: 2000,
  writable: true,
});

Object.defineProperty(document.body, 'scrollHeight', {
  value: 2000,
  writable: true,
});

Object.defineProperty(document.body, 'offsetHeight', {
  value: 2000,
  writable: true,
});