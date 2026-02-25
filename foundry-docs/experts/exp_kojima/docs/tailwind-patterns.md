---
title: "Tailwind CSS - Arquitectura y Patrones"
category: frontend
tags: [tailwind, css, styling, responsive]
difficulty: beginner
author: Hideo Kojima
last_updated: 2026-02-24
---

# Tailwind CSS - Arquitectura y Patrones

## Setup con React/Astro

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Configuración

```javascript
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          500: '#0ea5e9',
          900: '#0c4a6e',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
```

## Componentes Reutilizables

### Button

```tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export function Button({ 
  variant = 'primary', 
  size = 'md',
  isLoading,
  className = '',
  children,
  ...props 
}) {
  const variants = {
    primary: 'bg-brand-500 text-white hover:bg-brand-600',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
    ghost: 'bg-transparent hover:bg-gray-100',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };
  
  return (
    <button
      className={`
        inline-flex items-center justify-center
        font-medium rounded-lg
        transition-colors duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="..." />
        </svg>
      )}
      {children}
    </button>
  );
}
```

### Card

```tsx
function Card({ className = '', children, ...props }) {
  return (
    <div 
      className={`
        bg-white rounded-xl shadow-sm
        border border-gray-100
        overflow-hidden
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

Card.Header = function CardHeader({ className = '', children }) {
  return (
    <div className={`px-6 py-4 border-b border-gray-100 ${className}`}>
      {children}
    </div>
  );
};

Card.Body = function CardBody({ className = '', children }) {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>;
};

Card.Footer = function CardFooter({ className = '', children }) {
  return (
    <div className={`px-6 py-4 bg-gray-50 border-t border-gray-100 ${className}`}>
      {children}
    </div>
  );
};

// Uso
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
  <Card.Footer>Footer</Card.Footer>
</Card>
```

## Responsive Design

### Mobile First

```tsx
// Mobile: stack vertically
// Tablet+: side by side
// Desktop: full layout

function ResponsiveGrid() {
  return (
    <div className="
      grid gap-4
      grid-cols-1        // mobile
      sm:grid-cols-2     // 640px+
      lg:grid-cols-3     // 1024px+
      xl:grid-cols-4     // 1280px+
    ">
      {/* items */}
    </div>
  );
}
```

### Responsive Visibility

```tsx
function ResponsiveNav() {
  return (
    <>
      {/* Always visible */}
      <div className="block md:hidden">Mobile Menu</div>
      
      {/* Hidden on mobile */}
      <nav className="hidden md:flex gap-4">
        <a href="/">Home</a>
        <a href="/about">About</a>
      </nav>
    </>
  );
}
```

## Dark Mode

### Configuración

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class', // or 'media'
}
```

### Uso

```tsx
function ThemedComponent() {
  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Hello
      </h1>
      <button className="
        bg-brand-500 hover:bg-brand-600
        dark:bg-brand-400 dark:hover:bg-brand-500
      >
        Click me
      </button>
    </div>
  );
}

// Toggle
function ThemeToggle() {
  const [dark, setDark] = useState(false);
  
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);
  
  return (
    <button onClick={() => setDark(!dark)}>
      {dark ? '🌙' : '☀️'}
    </button>
  );
}
```

## Tailwind con Variables CSS

```css
/* globals.css */
:root {
  --color-primary: 14 165 233; /* brand-500 */
}

@layer base {
  .btn-primary {
    @apply px-4 py-2 rounded-lg font-medium;
    background-color: rgb(var(--color-primary));
    @apply hover:brightness-110 transition-all;
  }
}
```

---

**Meta:**
- Leer anterior: `react-components.md`
- Ver ejemplos: `../examples/tailwind-components.tsx`
