---
title: "Guía de Componentes React Modernos"
category: frontend
tags: [react, components, hooks, patterns]
difficulty: intermediate
author: Hideo Kojima
last_updated: 2026-02-24
---

# Guía de Componentes React Modernos

## Filosofías de Composición

Los componentes bien diseñados siguen el principio de **responsabilidad única**. Cada componente debe hacer una cosa y hacerla bien.

### Componentes Puros vs Impuros

```tsx
// ✅ Puro - mismo input, mismo output
function UserAvatar({ user }) {
  return <img src={user.avatar} alt={user.name} />;
}

// ⚠️ Impuro - depende de estado externo
function UserStatus({ userId }) {
  const [status, setStatus] = useState(null);
  // Este componente tiene efectos secundarios
}
```

## Patrones Avanzados

### 1. Compound Components

```tsx
function Menu({ children, defaultIndex = 0 }) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  
  return (
    <MenuContext.Provider value={{ activeIndex, setActiveIndex }}>
      <div className="menu">{children}</div>
    </MenuContext.Provider>
  );
}

Menu.Item = function MenuItem({ index, children }) {
  const { activeIndex, setActiveIndex } = useContext(MenuContext);
  return (
    <button 
      onClick={() => setActiveIndex(index)}
      className={activeIndex === index ? 'active' : ''}
    >
      {children}
    </button>
  );
};
```

### 2. Render Props

```tsx
function DataFetcher({ render }) {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetch('/api/data').then(res => res.json()).then(setData);
  }, []);
  
  return render(data);
}

// Uso
<DataFetcher render={data => <pre>{JSON.stringify(data)}</pre>} />
```

### 3. Custom Hooks para Lógica Reutilizable

```tsx
function useLocalStorage(key, initialValue) {
  const [stored, setStored] = useState(() => {
    if (typeof window === 'undefined') return initialValue;
    return JSON.parse(localStorage.getItem(key)) ?? initialValue;
  });
  
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(stored));
  }, [key, stored]);
  
  return [stored, setStored];
}
```

## Gestión de Estado

### Estado Local vs Global

| Tipo | Cuándo usar | Ejemplos |
|------|-------------|----------|
| Local | UI interna del componente | `isOpen`, `inputValue` |
| Shared | Componentes relacionados | `activeTab`, `filters` |
| Global | App-wide | `authUser`, `theme` |

### Zustand (Recomendado)

```tsx
import { create } from 'zustand';

const useStore = create((set) => ({
  count: 0,
  increment: () => set(state => ({ count: state.count + 1 })),
  reset: () => set({ count: 0 }),
}));

// Uso - sin Provider
function Counter() {
  const { count, increment } = useStore();
  return <button onClick={increment}>{count}</button>;
}
```

## Performance

### useMemo y useCallback

```tsx
function ExpensiveComponent({ data, filter }) {
  // Solo recalcula cuando cambia `filtered`
  const filtered = useMemo(
    () => data.filter(item => item.includes(filter)),
    [data, filter]
  );
  
  // Solo recrea la función cuando cambia handler
  const handleClick = useCallback(
    (id) => console.log('clicked', id),
    []
  );
  
  return filtered.map(item => (
    <Item key={item.id} onClick={handleClick} />
  ));
}
```

### React.memo

```tsx
const Button = React.memo(function Button({ onClick, children }) {
  return <button onClick={onClick}>{children}</button>;
});
```

## Testing

### Testing Library

```tsx
import { render, screen, fireEvent } from '@testing-library/react';

test('counter increments', () => {
  render(<Counter />);
  
  fireEvent.click(screen.getByText('Increment'));
  
  expect(screen.getByText('1')).toBeInTheDocument();
});
```

---

**Meta:**
- Leer siguiente: `animation-patterns.md`
- Ver ejemplos: `../examples/counter.tsx`
