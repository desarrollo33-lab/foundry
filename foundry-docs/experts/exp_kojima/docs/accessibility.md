---
title: "Accesibilidad Web - WCAG y Mejores Prácticas"
category: ui
tags: [accessibility, a11y, wcag, semantic-html]
difficulty: intermediate
author: Hideo Kojima
last_updated: 2026-02-24
---

# Accesibilidad Web - WCAG y Mejores Prácticas

## Fundamentos WCAG 2.1

### Principios

1. **Perceptible** - Información presentable de maneras que todos puedan percibir
2. **Operable** - Componentes de interfaz operables por todos
3. **Comprensible** - Información y operación comprensible
4. **Robusto** - Contenido suficientemente robusto para interpretables

### Niveles de Conformidad

| Nivel | Descripción |
|-------|-------------|
| A | Mínimo - básico accesibilidad |
| AA | Target estándar - mayoría de usuarios |
| AAA | Más alto - optimizado para todos |

## HTML Semántico

### Estructura Correcta

```html
<!-- ❌ Incorrecto -->
<div onclick="nav()">Navigate</div>
<div class="header">
  <div class="nav">...</div>
</div>

<!-- ✅ Correcto -->
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/">Home</a></li>
  </ul>
</nav>

<button onclick="nav()">Navigate</button>
```

### Encabezados

```html
<!-- ❌ Saltar niveles -->
<h1>Title</h1>
<h3>Subtitle</h3>

<!-- ✅ Secuencial -->
<h1>Title</h1>
<h2>Subtitle</h2>
<h3>Section</h3>
```

##ARIA Labels

### Cuándo Usar ARIA

> "Si puedes usar HTML nativo, úsalo. ARIA es para cuando HTML no es suficiente."

```tsx
// Input con error
<div>
  <label htmlFor="email">Email</label>
  <input 
    id="email" 
    type="email" 
    aria-invalid="true"
    aria-describedby="email-error"
  />
  <span id="email-error" role="alert">
    Please enter a valid email
  </span>
</div>
```

### Buttons vs Links

```tsx
// Button - acción en la página
<button onClick={openModal}>Open Modal</button>

// Link - navegación
<a href="/products">View Products</a>
```

### Live Regions

```tsx
// Alertas que announce a screen readers
<div role="alert" aria-live="polite">
  {message}
</div>

// Para actualizaciones de contenido
<div aria-live="assertive" aria-atomic="true">
  {cartCount} items in cart
</div>
```

## Focus Management

### Focus Visible

```css
/* ✅ Siempre visible */
:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* ⚠️ Quitar solo si provees alternativa */
:focus:not(:focus-visible) {
  outline: none;
}
```

### Focus Trap

```tsx
function Modal({ isOpen, onClose, children }) {
  const modalRef = useRef(null);
  
  useEffect(() => {
    if (isOpen) {
      // Trap focus inside modal
      const focusable = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      focusable[0]?.focus();
      
      // Handle Escape
      const handleEscape = (e) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <div 
      role="dialog" 
      aria-modal="true"
      ref={modalRef}
    >
      {children}
    </div>
  );
}
```

## Keyboard Navigation

### Tab Order

```tsx
// Visual order = logical order
<div className="flex">
  <button>1</button>  {/* Tab */}
  <button>2</button>  {/* Tab */}
  <button>3</button>  {/* Tab */}
</div>

// ⚠️ No usar tabindex > 0
<div tabIndex={1}>Primero</div>
<div tabIndex={2}>Segundo</div>
<div tabIndex={0}>Tercero</div>
```

### Skip Links

```tsx
function SkipLinks() {
  return (
    <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:p-4 focus:bg-white">
      Skip to main content
    </a>
  );
}
```

## Testing de Accesibilidad

### Lighthouse

```bash
# Run en Chrome DevTools
# Lighthouse > Accessibility > Analyze page load
```

### axe-core

```tsx
import { axe, run } from '@jest/axe';

test('component should be accessible', async () => {
  const { container } = render(<MyComponent />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### Screen Reader Testing

| OS | Lector | Atajo |
|----|--------|-------|
| macOS | VoiceOver | Cmd + F5 |
| Windows | NVDA | Insert + Down |
| Linux | Orca | Insert + S |

### Testing Checklist

- [ ] Navegar solo con teclado
- [ ] Verificar focus visible
- [ ] Probar con screen reader
- [ ] Verificar contraste de colores
- [ ] Probar zoom 200%
- [ ] Verificar ARIA labels
- [ ] Probar modo oscuro

---

**Meta:**
- Leer anterior: `tailwind-patterns.md`
- Ver ejemplos: `../examples/a11y-examples.tsx`
