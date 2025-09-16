export interface ScrollAwareNavOptions {
    /**
     * The pixel offset from which the navigation should be fixed
     * @default element.offsetHeight
     */
    startOffset?: number;

    /**
     * The minimum scroll distance in pixels required for a change
     * @default 8
     */
    tolerance?: number;

    /**
     * Whether the navigation should be shown at the end of the page
     * @default true
     */
    showAtBottom?: boolean;

    /**
     * CSS class names for different states
     */
    classNames?: {
        /**
         * Base class name
         * @default 'scroll-nav'
         */
        base?: string;

        /**
         * Class name for the fixed state
         * @default 'scroll-nav--fixed'
         */
        fixed?: string;

        /**
         * Class name for the hidden state
         * @default 'scroll-nav--hidden'
         */
        hidden?: string;
    };
}

export interface ScrollAwareNavClassNames {
    base: string;
    fixed: string;
    hidden: string;
}

export interface ScrollAwareNavInstance {
    /**
     * Initialize scroll monitoring
     */
    init(): void;

    /**
     * Reset all states
     */
    reset(): void;

    /**
     * Fix the navigation
     */
    fix(): void;

    /**
     * Hide the navigation
     */
    hide(): void;
}