import { clsx } from 'clsx'
import type { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Class-name merge helper required by shadcn-harvested components. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
