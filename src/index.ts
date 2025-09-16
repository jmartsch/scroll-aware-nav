/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import type { ScrollAwareNavClassNames, ScrollAwareNavInstance, ScrollAwareNavOptions } from './types';

/**
 * Check if code is running in a browser environment
 */
const isBrowser = (): boolean => {
    return typeof window === 'object' &&
        typeof document === 'object' &&
        document instanceof Document;
};

export class ScrollAwareNav implements ScrollAwareNavInstance {
    private readonly element: HTMLElement;
    private readonly startOffset: number;
    private readonly tolerance: number;
    private readonly showAtBottom: boolean;
    private readonly classNames: ScrollAwareNavClassNames;
    private readonly scrollOptions: AddEventListenerOptions;
    private scrollLast: number;
    private scrollRAF?: number;
    private isInitialized = false;

    constructor(element: HTMLElement | null, options: ScrollAwareNavOptions = {}) {
        if (!isBrowser()) {
            throw new Error('ScrollAwareNav can only be used in a browser environment');
        }

        if (!element) {
            throw new Error('An HTML element must be provided for ScrollAwareNav');
        }

        if (!ScrollAwareNav.isSupported()) {
            throw new Error('ScrollAwareNav is not supported in this browser');
        }

        this.element = element;
        this.startOffset = options.startOffset ?? element.offsetHeight;
        this.tolerance = options.tolerance ?? 8;
        this.showAtBottom = options.showAtBottom ?? true;
        this.classNames = {
            base: options.classNames?.base ?? 'scroll-nav',
            fixed: options.classNames?.fixed ?? 'scroll-nav--fixed',
            hidden: options.classNames?.hidden ?? 'scroll-nav--hidden'
        };
        this.scrollOptions = { passive: true };
        this.scrollLast = window.pageYOffset;
        this.init();
    }

    /**
     * Check if required browser features are supported
     */
    static isSupported(): boolean {
        if (!isBrowser()) return false;

        try {
            return !!(
                'requestAnimationFrame' in window &&
                'classList' in document.documentElement
            );
        } catch {
            return false;
        }
    }

    /**
     * Initialize scroll monitoring
     */
    public init(): void {
        if (this.isInitialized) {
            return;
        }

        this.isInitialized = true;
        this.addClass(this.classNames.base);
        window.addEventListener('scroll', this.handleScroll, this.scrollOptions);
    }

    /**
     * Remove scroll monitoring and all associated classes
     */
    public destroy(): void {
        if (!this.isInitialized) {
            return;
        }

        this.isInitialized = false;
        window.removeEventListener('scroll', this.handleScroll, this.scrollOptions);
        this.reset();
        if (this.scrollRAF) {
            window.cancelAnimationFrame(this.scrollRAF);
            this.scrollRAF = undefined;
        }
    }

    /**
     * Reset all states
     */
    public reset(): void {
        this.removeClass(this.classNames.fixed, this.classNames.hidden);
    }

    /**
     * Fix the navigation
     */
    public fix(): void {
        this.addClass(this.classNames.fixed);
        this.removeClass(this.classNames.hidden);
    }

    /**
     * Hide the navigation
     */
    public hide(): void {
        this.addClass(this.classNames.hidden);
    }

    /**
     * Add CSS classes to the element
     */
    private addClass(...classNames: string[]): void {
        this.element.classList.add(...classNames);
    }

    /**
     * Remove CSS classes from the element
     */
    private removeClass(...classNames: string[]): void {
        this.element.classList.remove(...classNames);
    }

    /**
     * Handle scroll events with RequestAnimationFrame for better performance
     */
    private handleScroll = (): void => {
        if (this.scrollRAF) {
            return;
        }

        this.scrollRAF = window.requestAnimationFrame(() => {
            const scrollCurrent = window.pageYOffset;
            const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
            const scrollHeight = this.getScrollHeight();

            if (scrollCurrent <= 0) {
                this.reset();
            } else if (
                this.showAtBottom &&
                viewportHeight + scrollCurrent >= scrollHeight - 1
            ) {
                this.fix();
            } else if (
                scrollCurrent > this.startOffset &&
                Math.abs(scrollCurrent - this.scrollLast) >= this.tolerance
            ) {
                scrollCurrent > this.scrollLast ? this.hide() : this.fix();
            }

            this.scrollLast = scrollCurrent;
            this.scrollRAF = undefined;
        });
    };

    /**
     * Get the current document height
     */
    private getScrollHeight(): number {
        const body = document.body;
        const html = document.documentElement;

        if (!body || !html) {
            return 0;
        }

        return Math.max(html.scrollHeight, body.scrollHeight, html.offsetHeight, body.offsetHeight);
    }
}

// Export types for better DX
export type { ScrollAwareNavClassNames, ScrollAwareNavInstance, ScrollAwareNavOptions };

// Default export for easier usage
export default ScrollAwareNav;
