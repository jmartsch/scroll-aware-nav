# Scroll Aware Nav

Eine TypeScript-Library für intelligentes Scroll-Verhalten von Navigationselementen.

## Features

- Automatisches Ein-/Ausblenden der Navigation beim Scrollen
- Konfigurierbare Scroll-Toleranz
- TypeScript-Support
- Keine Abhängigkeiten
- Optimierte Performance durch RequestAnimationFrame
- SSR-freundlich

## Installation

```bash
bun add scroll-aware-nav
```

oder

```bash
npm install scroll-aware-nav
```

## Verwendung

```typescript
import ScrollAwareNav from 'scroll-aware-nav';

// HTML-Element auswählen
const header = document.querySelector('.header');

// ScrollAwareNav initialisieren
const nav = new ScrollAwareNav(header, {
  // Optionale Konfiguration
  startOffset: 200,      // Ab welcher Scroll-Position die Navigation fixiert wird
  tolerance: 8,          // Minimale Scroll-Distanz für Zustandsänderungen
  showAtBottom: true,    // Navigation am Seitenende anzeigen
  classNames: {
    base: 'scroll-nav',
    fixed: 'scroll-nav--fixed',
    hidden: 'scroll-nav--hidden'
  }
});
```

### CSS

Fügen Sie die folgenden CSS-Stile hinzu oder importieren Sie die mitgelieferten Styles:

```css
/* Option 1: Standard-Styles importieren */
@import 'scroll-aware-nav/style.css';

/* Option 2: Eigene Styles definieren */
.scroll-nav {
  transition: transform 0.3s ease;
}

.scroll-nav--fixed {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
}

.scroll-nav--hidden {
  transform: translateY(-100%);
}
```

## API

### Optionen

```typescript
interface ScrollAwareNavOptions {
  startOffset?: number;    // Standard: Element-Höhe
  tolerance?: number;      // Standard: 8
  showAtBottom?: boolean;  // Standard: true
  classNames?: {
    base?: string;        // Standard: 'scroll-nav'
    fixed?: string;       // Standard: 'scroll-nav--fixed'
    hidden?: string;      // Standard: 'scroll-nav--hidden'
  };
}
```

### Methoden

- `init()`: Initialisiert die Scroll-Überwachung
- `destroy()`: Entfernt die Scroll-Überwachung und alle zugehörigen Klassen
- `reset()`: Setzt alle Zustände zurück
- `fix()`: Fixiert die Navigation
- `hide()`: Blendet die Navigation aus

## Browser-Unterstützung

Die Library unterstützt alle modernen Browser, die `requestAnimationFrame` und `classList` unterstützen.

## Entwicklung

```bash
# Installation der Abhängigkeiten
bun install

# Entwicklungsserver starten
bun run dev

# Build erstellen
bun run build
```

## Lizenz

MIT