export interface ScrollAwareNavOptions {
    /**
     * Der Offset in Pixeln, ab dem die Navigation fixiert werden soll
     * @default element.offsetHeight
     */
    startOffset?: number;

    /**
     * Die minimale Scroll-Distanz in Pixeln, die für eine Änderung erforderlich ist
     * @default 8
     */
    tolerance?: number;

    /**
     * Ob die Navigation am Ende der Seite angezeigt werden soll
     * @default true
     */
    showAtBottom?: boolean;

    /**
     * CSS-Klassennamen für verschiedene Zustände
     */
    classNames?: {
        /**
         * Basis-Klassenname
         * @default 'scroll-nav'
         */
        base?: string;

        /**
         * Klassenname für den fixierten Zustand
         * @default 'scroll-nav--fixed'
         */
        fixed?: string;

        /**
         * Klassenname für den ausgeblendeten Zustand
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
     * Initialisiert die Scroll-Überwachung
     */
    init(): void;

    /**
     * Setzt alle Zustände zurück
     */
    reset(): void;

    /**
     * Fixiert die Navigation
     */
    fix(): void;

    /**
     * Blendet die Navigation aus
     */
    hide(): void;
}