import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combina clases de forma inteligente
 * Evita conflictos y duplicados
 * 
 * @example
 * cn('px-4 py-2', 'px-6') // → 'py-2 px-6' (px-4 overridden)
 * cn('text-red-500', condition && 'text-blue-500') // → conditional
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
