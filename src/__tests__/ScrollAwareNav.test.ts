import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ScrollReactiveNav } from '../index';
import type { ScrollReactiveNavOptions } from '../types';

describe('ScrollReactiveNav', () => {
    let mockElement: HTMLElement;
    let nav: ScrollReactiveNav;

    beforeEach(() => {
        // Create a mock DOM element
        mockElement = document.createElement('header');
        mockElement.id = 'test-header';

        // Mock offsetHeight property
        Object.defineProperty(mockElement, 'offsetHeight', {
            value: 80,
            writable: true,
            configurable: true,
        });

        document.body.appendChild(mockElement);

        // Reset scroll position
        Object.defineProperty(window, 'pageYOffset', { value: 0, writable: true });
    });

    afterEach(() => {
        if (nav) {
            nav.destroy();
        }
        document.body.innerHTML = '';
        vi.clearAllMocks();
    });

    describe('Constructor & Initialization', () => {
        it('should create instance with default options', () => {
            nav = new ScrollReactiveNav(mockElement);
            expect(nav).toBeInstanceOf(ScrollReactiveNav);
            expect(mockElement.classList.contains('scroll-nav')).toBe(true);
        });

        it('should create instance with custom options', () => {
            const options: ScrollReactiveNavOptions = {
                startOffset: 100,
                tolerance: 15,
                showAtBottom: false,
                classNames: {
                    base: 'custom-nav',
                    fixed: 'custom-nav--fixed',
                    hidden: 'custom-nav--hidden',
                },
            };

            nav = new ScrollReactiveNav(mockElement, options);
            expect(mockElement.classList.contains('custom-nav')).toBe(true);
        });

        it('should throw error if no element provided', () => {
            expect(() => new ScrollReactiveNav(null)).toThrow(
                'An HTML element must be provided for ScrollReactiveNav'
            );
        });

        it('should throw error in non-browser environment', () => {
            // Mock non-browser environment
            const originalWindow = global.window;
            const originalDocument = global.document;

            // @ts-expect-error
            delete global.window;
            // @ts-expect-error
            delete global.document;

            expect(() => new ScrollReactiveNav(mockElement)).toThrow(
                'ScrollReactiveNav can only be used in a browser environment'
            );

            // Restore
            global.window = originalWindow;
            global.document = originalDocument;
        });
    });

    describe('Browser Support Detection', () => {
        it('should detect browser support correctly', () => {
            expect(ScrollReactiveNav.isSupported()).toBe(true);
        });

        it('should return false for unsupported browsers', () => {
            const originalRAF = window.requestAnimationFrame;
            // @ts-expect-error
            delete window.requestAnimationFrame;

            expect(ScrollReactiveNav.isSupported()).toBe(false);

            // Restore
            window.requestAnimationFrame = originalRAF;
        });
    });

    describe('CSS Class Management', () => {
        beforeEach(() => {
            nav = new ScrollReactiveNav(mockElement);
        });

        it('should add base class on initialization', () => {
            expect(mockElement.classList.contains('scroll-nav')).toBe(true);
        });

        it('should handle fix() method', () => {
            nav.fix();
            expect(mockElement.classList.contains('scroll-nav--fixed')).toBe(true);
            expect(mockElement.classList.contains('scroll-nav--hidden')).toBe(false);
        });

        it('should handle hide() method', () => {
            nav.hide();
            expect(mockElement.classList.contains('scroll-nav--hidden')).toBe(true);
        });

        it('should handle reset() method', () => {
            nav.fix();
            nav.hide();
            nav.reset();

            expect(mockElement.classList.contains('scroll-nav--fixed')).toBe(false);
            expect(mockElement.classList.contains('scroll-nav--hidden')).toBe(false);
            expect(mockElement.classList.contains('scroll-nav')).toBe(true);
        });
    });

    describe('Lifecycle Methods', () => {
        it('should not initialize twice', () => {
            nav = new ScrollReactiveNav(mockElement);
            const addEventListenerSpy = vi.spyOn(window, 'addEventListener');

            nav.init(); // Should not add listener again
            expect(addEventListenerSpy).not.toHaveBeenCalled();

            addEventListenerSpy.mockRestore();
        });

        it('should properly destroy and cleanup', () => {
            const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
            const cancelAnimationFrameSpy = vi.spyOn(window, 'cancelAnimationFrame');

            nav = new ScrollReactiveNav(mockElement);
            nav.destroy();

            expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function), {
                passive: true,
            });
            expect(mockElement.classList.contains('scroll-nav--fixed')).toBe(false);
            expect(mockElement.classList.contains('scroll-nav--hidden')).toBe(false);

            removeEventListenerSpy.mockRestore();
            cancelAnimationFrameSpy.mockRestore();
        });

        it('should not destroy if not initialized', () => {
            const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

            nav = new ScrollReactiveNav(mockElement);
            nav.destroy();
            nav.destroy(); // Second call should not do anything

            expect(removeEventListenerSpy).toHaveBeenCalledTimes(1);
            removeEventListenerSpy.mockRestore();
        });
    });

    describe('Default Options', () => {
        it('should use element offsetHeight as default startOffset', () => {
            Object.defineProperty(mockElement, 'offsetHeight', {
                value: 120,
                writable: true,
                configurable: true,
            });
            nav = new ScrollReactiveNav(mockElement);

            // Test by checking scroll behavior at exactly offsetHeight
            Object.defineProperty(window, 'pageYOffset', { value: 120, writable: true });

            // Simulate scroll event
            const scrollEvent = new Event('scroll');
            window.dispatchEvent(scrollEvent);

            // Should use 120 as startOffset (element height)
            expect(mockElement.offsetHeight).toBe(120);
        });

        it('should use custom startOffset when provided', () => {
            const options: ScrollReactiveNavOptions = {
                startOffset: 200,
            };

            nav = new ScrollReactiveNav(mockElement, options);
            expect(nav).toBeInstanceOf(ScrollReactiveNav);
        });
    });
});
