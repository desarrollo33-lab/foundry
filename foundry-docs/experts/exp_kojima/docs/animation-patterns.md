---
title: "Patrones de Animación con Framer Motion"
category: animation
tags: [animation, framer-motion, react, ux]
difficulty: intermediate
author: Hideo Kojima
last_updated: 2026-02-24
---

# Patrones de Animación con Framer Motion

## Transiciones de Página

### Page Transitions

```tsx
import { motion, AnimatePresence } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 }
};

function Page({ children }) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

// Con AnimatePresence para exit animations
<AnimatePresence mode="wait">
  <Routes>
    <Route path="/" element={<Page><Home /></Page>} />
  </Routes>
</AnimatePresence>
```

## Gestos y Interacciones

### Drag & Drop

```tsx
function DraggableCard({ item }) {
  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: 100, top: 0, bottom: 100 }}
      whileDrag={{ scale: 1.1, cursor: 'grabbing' }}
      whileHover={{ scale: 1.05, cursor: 'grab' }}
    >
      {item.content}
    </motion.div>
  );
}
```

### Scroll Animations

```tsx
function AnimatedList({ items }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={{
        hidden: { opacity: 0 },
        visible: { 
          opacity: 1,
          transition: { staggerChildren: 0.1 }
        }
      }}
    >
      {items.map(item => (
        <motion.div
          key={item.id}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
        >
          {item.content}
        </motion.div>
      ))}
    </motion.div>
  );
}
```

## Micro-interacciones

### Button States

```tsx
function AnimatedButton({ children, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0px 5px 15px rgba(0,0,0,0.2)"
      }}
      transition={{ type: "spring", stiffness: 400 }}
    >
      {children}
    </motion.button>
  );
}
```

### Loading States

```tsx
function LoadingSpinner() {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ 
        repeat: Infinity, 
        duration: 1, 
        ease: "linear" 
      }}
      style={{
        width: 24,
        height: 24,
        borderRadius: "50%",
        border: "2px solid #ddd",
        borderTopColor: "#333"
      }}
    />
  );
}
```

## Layout Animations

### Shared Element Transition

```tsx
function Gallery() {
  return (
    <LayoutGroup>
      <motion.div layoutId="card-1">
        <img src="/img1.jpg" />
      </motion.div>
      <motion.div layoutId="card-2">
        <img src="/img2.jpg" />
      </motion.div>
    </LayoutGroup>
  );
}

// Al navegar, la card hace transition suave
```

### Accordion

```tsx
function Accordion({ items }) {
  return (
    <div>
      {items.map(item => (
        <AccordionItem key={item.id} item={item} />
      ))}
    </div>
  );
}

function AccordionItem({ item }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        layout
      >
        {item.title}
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
        >
          ▼
        </motion.span>
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            {item.content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

## Performance Tips

### useAnimationControls

```tsx
function DragToDismiss() {
  const controls = useAnimationControls();
  
  useEffect(() => {
    // Secuencia de animaciones
    controls.start({
      x: 0,
      transition: { type: "spring", bounce: 0.4 }
    });
  }, []);
  
  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      animate={controls}
      onDragEnd={(e, { offset, velocity }) => {
        if (offset.x > 100) {
          controls.start({ x: 200, opacity: 0 });
        }
      }}
    />
  );
}
```

---

**Meta:**
- Leer anterior: `react-components.md`
- Ver ejemplos: `../examples/animation-demo.tsx`
