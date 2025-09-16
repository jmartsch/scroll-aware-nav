import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ScrollReactiveNav } from '../index';

describe('ScrollReactiveNav - Scroll Behavior', () => {
    let mockElement: HTMLElement;
    let nav: ScrollReactiveNav;

    beforeEach(() => {
        mockElement = document.createElement('header');

        // Mock offsetHeight property
        Object.defineProperty(mockElement, 'offsetHeight', {
            value: 80,
            writable: true,
            configurable: true,
        });

        document.body.appendChild(mockElement);

        // Reset scroll position
        Object.defineProperty(window, 'pageYOffset', { value: 0, writable: true });
        Object.defineProperty(window, 'innerHeight', { value: 1024, writable: true });
        Object.defineProperty(document.documentElement, 'clientHeight', {
            value: 1024,
            writable: true,
        });

        vi.useFakeTimers();
    });

    afterEach(() => {
        if (nav) {
            nav.destroy();
        }
        document.body.innerHTML = '';
        vi.clearAllMocks();
        vi.useRealTimers();
    });

    describe('Scroll Detection', () => {
        it('should not react to scroll at top of page', async () => {
            nav = new ScrollReactiveNav(mockElement, { tolerance: 8 });

            // Scroll to top
            Object.defineProperty(window, 'pageYOffset', { value: 0, writable: true });

            const scrollEvent = new Event('scroll');
            window.dispatchEvent(scrollEvent);

            // Wait for RAF
            await vi.runAllTimersAsync();

            expect(mockElement.classList.contains('scroll-nav--hidden')).toBe(false);
            expect(mockElement.classList.contains('scroll-nav--fixed')).toBe(false);
        });

        it('should show navigation when scrolling up', async () => {
            nav = new ScrollReactiveNav(mockElement, { tolerance: 8, startOffset: 50 });

            // Simulate scrolling down past startOffset
            Object.defineProperty(window, 'pageYOffset', { value: 200, writable: true });
            window.dispatchEvent(new Event('scroll'));
            await vi.runAllTimersAsync();

            // Then scroll up (simulate upward scroll by reducing pageYOffset)
            Object.defineProperty(window, 'pageYOffset', { value: 180, writable: true });
            window.dispatchEvent(new Event('scroll'));
            await vi.runAllTimersAsync();

            expect(mockElement.classList.contains('scroll-nav--fixed')).toBe(true);
            expect(mockElement.classList.contains('scroll-nav--hidden')).toBe(false);
        });

        it('should hide navigation when scrolling down', async () => {
            nav = new ScrollReactiveNav(mockElement, { tolerance: 8, startOffset: 50 });

            // Start from a scrolled position
            Object.defineProperty(window, 'pageYOffset', { value: 100, writable: true });
            window.dispatchEvent(new Event('scroll'));
            await vi.runAllTimersAsync();

            // Scroll down beyond tolerance
            Object.defineProperty(window, 'pageYOffset', { value: 120, writable: true });
            window.dispatchEvent(new Event('scroll'));
            await vi.runAllTimersAsync();

            expect(mockElement.classList.contains('scroll-nav--hidden')).toBe(true);
        });

        it('should respect tolerance setting', async () => {
            const tolerance = 15;
            nav = new ScrollReactiveNav(mockElement, { tolerance, startOffset: 20 });

            // Start from scrolled position above startOffset
            Object.defineProperty(window, 'pageYOffset', { value: 50, writable: true });
            window.dispatchEvent(new Event('scroll'));
            await vi.runAllTimersAsync();

            // Scroll down exactly tolerance amount (should trigger hide because >= tolerance)
            Object.defineProperty(window, 'pageYOffset', { value: 65, writable: true }); // 15px difference
            window.dispatchEvent(new Event('scroll'));
            await vi.runAllTimersAsync();

            // Should be hidden since we're >= tolerance and scrolling down
            expect(mockElement.classList.contains('scroll-nav--hidden')).toBe(true);

            // Reset nav state
            nav.reset();

            // Set initial position again
            Object.defineProperty(window, 'pageYOffset', { value: 50, writable: true });
            window.dispatchEvent(new Event('scroll'));
            await vi.runAllTimersAsync();

            // Scroll down less than tolerance (should NOT trigger hide)
            Object.defineProperty(window, 'pageYOffset', { value: 64, writable: true }); // 14px difference < 15px tolerance
            window.dispatchEvent(new Event('scroll'));
            await vi.runAllTimersAsync();

            // Should NOT be hidden since we're below tolerance
            expect(mockElement.classList.contains('scroll-nav--hidden')).toBe(false);
        });
    });

    describe('Bottom of Page Behavior', () => {
        it('should show navigation at bottom of page when showAtBottom is true', async () => {
            nav = new ScrollReactiveNav(mockElement, { showAtBottom: true });

            // Mock being at bottom of page
            const viewportHeight = 1024;
            const scrollHeight = 2000;
            Object.defineProperty(window, 'innerHeight', { value: viewportHeight, writable: true });
            Object.defineProperty(window, 'pageYOffset', {
                value: scrollHeight - viewportHeight,
                writable: true,
            });
            Object.defineProperty(document.documentElement, 'scrollHeight', {
                value: scrollHeight,
                writable: true,
            });

            window.dispatchEvent(new Event('scroll'));
            await vi.runAllTimersAsync();

            expect(mockElement.classList.contains('scroll-nav--fixed')).toBe(true);
            expect(mockElement.classList.contains('scroll-nav--hidden')).toBe(false);
        });

        it('should not show navigation at bottom when showAtBottom is false', async () => {
            nav = new ScrollReactiveNav(mockElement, { showAtBottom: false, startOffset: 50 });

            // Scroll down first to hide it
            Object.defineProperty(window, 'pageYOffset', { value: 200, writable: true });
            window.dispatchEvent(new Event('scroll'));
            await vi.runAllTimersAsync();

            // Mock being at bottom of page
            const viewportHeight = 1024;
            const scrollHeight = 2000;
            Object.defineProperty(window, 'innerHeight', { value: viewportHeight, writable: true });
            Object.defineProperty(window, 'pageYOffset', {
                value: scrollHeight - viewportHeight,
                writable: true,
            });

            window.dispatchEvent(new Event('scroll'));
            await vi.runAllTimersAsync();

            // Should remain hidden
            expect(mockElement.classList.contains('scroll-nav--hidden')).toBe(true);
        });
    });

    describe('RequestAnimationFrame Optimization', () => {
        it('should use RAF for scroll handling', async () => {
            const rafSpy = vi.spyOn(window, 'requestAnimationFrame');

            nav = new ScrollReactiveNav(mockElement);

            Object.defineProperty(window, 'pageYOffset', { value: 100, writable: true });
            window.dispatchEvent(new Event('scroll'));

            expect(rafSpy).toHaveBeenCalledWith(expect.any(Function));

            rafSpy.mockRestore();
        });

        it('should not queue multiple RAF calls', async () => {
            const rafSpy = vi.spyOn(window, 'requestAnimationFrame');

            nav = new ScrollReactiveNav(mockElement);

            // Fire multiple scroll events quickly
            window.dispatchEvent(new Event('scroll'));
            window.dispatchEvent(new Event('scroll'));
            window.dispatchEvent(new Event('scroll'));

            // Should only call RAF once
            expect(rafSpy).toHaveBeenCalledTimes(1);

            rafSpy.mockRestore();
        });

        it('should cancel RAF on destroy', () => {
            const cancelRAFSpy = vi.spyOn(window, 'cancelAnimationFrame');

            nav = new ScrollReactiveNav(mockElement);

            // Trigger scroll to create RAF
            window.dispatchEvent(new Event('scroll'));

            nav.destroy();

            expect(cancelRAFSpy).toHaveBeenCalled();

            cancelRAFSpy.mockRestore();
        });
    });

    describe('Custom CSS Classes', () => {
        it('should use custom class names', async () => {
            const customClasses = {
                base: 'my-nav',
                fixed: 'my-nav--sticky',
                hidden: 'my-nav--hide',
            };

            nav = new ScrollReactiveNav(mockElement, { classNames: customClasses });

            expect(mockElement.classList.contains('my-nav')).toBe(true);

            nav.fix();
            expect(mockElement.classList.contains('my-nav--sticky')).toBe(true);

            nav.hide();
            expect(mockElement.classList.contains('my-nav--hide')).toBe(true);
        });
    });
});
