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
    private scrollLast: number;
    private scrollRAF?: number;

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
        this.startOffset = this.getOptionOrDefault(options.startOffset, element.offsetHeight);
        this.tolerance = this.getOptionOrDefault(options.tolerance, 8);
        this.showAtBottom = this.getOptionOrDefault(options.showAtBottom, true);
        this.classNames = {
            base: options.classNames?.base ?? 'scroll-nav',
            fixed: options.classNames?.fixed ?? 'scroll-nav--fixed',
            hidden: options.classNames?.hidden ?? 'scroll-nav--hidden'
        };
        this.scrollLast = 0;
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
        this.addClass(this.classNames.base);
        window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
    }

    /**
     * Entfernt die Scroll-Überwachung und alle zugehörigen Klassen
     */
    public destroy(): void {
        window.removeEventListener('scroll', this.handleScroll.bind(this));
        this.reset();
        if (this.scrollRAF) {
            window.cancelAnimationFrame(this.scrollRAF);
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
     * Gibt den Optionswert oder den Standardwert zurück
     */
    private getOptionOrDefault<T>(option: T | undefined, defaultValue: T): T {
        return typeof option !== 'undefined' ? option : defaultValue;
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

            if (scrollCurrent <= 0) {
                this.reset();
            } else if (
                this.showAtBottom &&
                window.innerHeight + scrollCurrent >= document.body.offsetHeight
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
}

// Export Typen für bessere DX
export type { ScrollAwareNavOptions, ScrollAwareNavClassNames, ScrollAwareNavInstance };

// Default export für einfachere Verwendung
export default ScrollAwareNav;