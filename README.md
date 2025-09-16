# Scroll Aware Navigation

**Next-generation smart header behavior for modern web experiences.**

A lightweight, intelligent navigation component that creates seamless user experiences through context-aware visibility. Inspired by mobile Safari's chrome behavior and adopted by sites like Medium and Teehan+Lax.

## Why Different from Headroom.js?

While similar in concept to headroom.js, this library focuses on key improvements:

✨ **Natural scroll behavior** - Header initially scrolls out naturally like static content
🎯 **Smart reappearance** - Fixed positioning only when scrolling up, respecting scroll tolerance
📱 **Mobile-first UX** - Interaction patterns that mirror mobile Safari's chrome behavior
🎨 **Minimal & opinionated** - Smaller footprint with sensible defaults
⚡ **Enhanced performance** - Optimized RAF usage and passive event listeners

## Features

- Smart show/hide navigation on scroll with configurable tolerance
- Natural initial scroll behavior (non-sticky until needed)
- Bottom-of-page reappearance for better UX
- Zero dependencies with full TypeScript support
- RequestAnimationFrame optimization for 60fps smoothness
- SSR-compatible with proper browser detection
- Passive event listeners for better scroll performance
- Customizable CSS classes and behavior options

## Bundle Size

ScrollAwareNav is incredibly lightweight:

- **ES Module**: 3.92 KB (1.22 KB gzipped)
- **UMD Bundle**: 2.67 KB (1.05 KB gzipped)
- **TypeScript Declarations**: 2.75 KB
- **Total Package**: ~6.6 KB unpacked

Built with Vite 7 for optimal tree-shaking and modern bundle optimization.

## Installation

### Via npm/pnpm/bun

```bash
npm install scroll-aware-nav
# oder
pnpm add scroll-aware-nav
# oder
bun add scroll-aware-nav
```

### Via ES6 Module (Development)

```html
<script type="module">
  import { ScrollAwareNav } from '/src/index.ts';

  const header = document.getElementById('header');
  const nav = new ScrollAwareNav(header);
</script>
```

## Quick Start

```html
<!-- HTML -->
<header id="header">
  <nav>Your Navigation</nav>
</header>

<script type="module">
  import { ScrollAwareNav } from 'scroll-aware-nav';

  const header = document.getElementById('header');
  const nav = new ScrollAwareNav(header);
</script>
```

## Advanced Configuration

```typescript
import { ScrollAwareNav } from 'scroll-aware-nav';

// Select your header element
const header = document.querySelector('.header');

// Initialize with options
const nav = new ScrollAwareNav(header, {
  startOffset: 200,      // Scroll position when logic activates
  tolerance: 8,          // Minimum scroll distance for state changes
  showAtBottom: true,    // Show navigation at page bottom
  classNames: {
    base: 'scroll-nav',
    fixed: 'scroll-nav--fixed',
    hidden: 'scroll-nav--hidden'
  }
});
```

## CSS

Add the essential CSS styles:

```css
/* Base class */
.scroll-nav {
  transition: transform 0.3s ease;
  will-change: transform;
  z-index: 1000;
}

/* Fixed state */
.scroll-nav--fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Hidden state */
.scroll-nav--hidden {
  transform: translateY(-100%);
}

/* Optional: Prevent content jump when fixing */
.scroll-nav--fixed + * {
  margin-top: var(--scroll-nav-height, 0px);
}
```

## Configuration Options

The `ScrollAwareNav` class accepts these options as the second parameter:

### Complete Options

```typescript
const nav = new ScrollAwareNav(header, {
  startOffset: 100,        // Height where logic activates
  tolerance: 8,            // Scroll tolerance in pixels
  showAtBottom: true,      // Show navigation at page bottom
  classNames: {
    base: 'scroll-nav',           // Base CSS class
    fixed: 'scroll-nav--fixed',   // Class for fixed state
    hidden: 'scroll-nav--hidden'  // Class for hidden state
  }
});
```

### Option Details

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `startOffset` | `number` | `element.offsetHeight` | Pixel offset where scroll logic activates |
| `tolerance` | `number` | `8` | Minimum scroll distance before changes occur |
| `showAtBottom` | `boolean` | `true` | Show navigation when page bottom is reached |
| `classNames.base` | `string` | `'scroll-nav'` | Base CSS class for the element |
| `classNames.fixed` | `string` | `'scroll-nav--fixed'` | CSS class for fixed state |
| `classNames.hidden` | `string` | `'scroll-nav--hidden'` | CSS class for hidden state |

## API Methods

### `init()`
Initializes scroll monitoring (called automatically on creation).

```typescript
nav.init();
```

### `destroy()`
Removes all event listeners and CSS classes.

```typescript
nav.destroy();
```

### `reset()`
Resets navigation to original state.

```typescript
nav.reset();
```

### `fix()`
Fixes navigation to top of viewport.

```typescript
nav.fix();
```

### `hide()`
Hides the navigation.

```typescript
nav.hide();
```

## Static Methods

### `ScrollAwareNav.isSupported()`
Checks if browser supports required features.

```typescript
if (ScrollAwareNav.isSupported()) {
  const nav = new ScrollAwareNav(header);
}
```

## Examples

### Custom Tolerance

```typescript
const nav = new ScrollAwareNav(header, {
  tolerance: 15  // Navigation reacts after 15px scroll difference
});
```

### No Bottom Show

```typescript
const nav = new ScrollAwareNav(header, {
  showAtBottom: false  // Navigation stays hidden at bottom
});
```

### Custom CSS Classes

```typescript
const nav = new ScrollAwareNav(header, {
  classNames: {
    base: 'my-nav',
    fixed: 'my-nav--stick',
    hidden: 'my-nav--hide'
  }
});
```

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- IE11+ (with `requestAnimationFrame` polyfills)
- Mobile Safari (iOS)
- Chrome Mobile (Android)

## TypeScript

Fully written in TypeScript with complete type definitions:

```typescript
import {
  ScrollAwareNav,
  ScrollAwareNavOptions,
  ScrollAwareNavClassNames,
  ScrollAwareNavInstance
} from 'scroll-aware-nav';
```

## Performance

- Uses `requestAnimationFrame` for smooth animations
- Passive event listeners for better scroll performance
- Minimal DOM access through intelligent state management
- Zero external dependencies

## Development

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build
```

## License

MIT