import type { ScrollAwareNavOptions, ScrollAwareNavClassNames, ScrollAwareNavInstance } from './types';

/**
 * Überprüft, ob der Code in einer Browser-Umgebung ausgeführt wird
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
            throw new Error('ScrollAwareNav kann nur in einer Browser-Umgebung verwendet werden');
        }

        if (!element) {
            throw new Error('Ein HTML-Element muss für ScrollAwareNav bereitgestellt werden');
        }

        if (!ScrollAwareNav.isSupported()) {
            throw new Error('ScrollAwareNav wird in diesem Browser nicht unterstützt');
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
     * Überprüft, ob die erforderlichen Browser-Features unterstützt werden
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
     * Initialisiert die Scroll-Überwachung
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
     * Entfernt die Scroll-Überwachung und alle zugehörigen Klassen
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
     * Setzt alle Zustände zurück
     */
    public reset(): void {
        this.removeClass(this.classNames.fixed, this.classNames.hidden);
    }

    /**
     * Fixiert die Navigation
     */
    public fix(): void {
        this.addClass(this.classNames.fixed);
        this.removeClass(this.classNames.hidden);
    }

    /**
     * Blendet die Navigation aus
     */
    public hide(): void {
        this.addClass(this.classNames.hidden);
    }

    /**
     * Fügt CSS-Klassen zum Element hinzu
     */
    private addClass(...classNames: string[]): void {
        this.element.classList.add(...classNames);
    }

    /**
     * Entfernt CSS-Klassen vom Element
     */
    private removeClass(...classNames: string[]): void {
        this.element.classList.remove(...classNames);
    }

    /**
     * Behandelt das Scroll-Event mit RequestAnimationFrame für bessere Performance
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
     * Gibt die aktuelle Dokumenthöhe zurück
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

// Export Typen für bessere DX
export type { ScrollAwareNavOptions, ScrollAwareNavClassNames, ScrollAwareNavInstance };

// Default export für einfachere Verwendung
export default ScrollAwareNav;
