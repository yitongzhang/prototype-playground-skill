import type { ComponentType } from 'react'

export interface PrototypeEntry {
  /** URL slug: the prototype renders at #/<slug>. Lowercase, hyphens. */
  slug: string
  name: string
  /** One or two sentences: what this iteration explores and how it differs from master. */
  description: string
  /**
   * 'master' is the pixel-perfect clone of the production main screen.
   * It is the source of truth — never edit it when building an iteration.
   */
  kind: 'master' | 'iteration'
  /** YYYY-MM-DD */
  createdAt: string
  /** Optional card image, served from public/ (e.g. '/thumbnails/master.png'). */
  thumbnail?: string
  load: () => Promise<{ default: ComponentType }>
}

/**
 * Every prototype in this playground. To add an iteration:
 * copy src/prototypes/master/ to src/prototypes/<slug>/, then append an entry here.
 */
export const prototypes: PrototypeEntry[] = [
  {
    slug: 'master',
    name: 'Master — production clone',
    description:
      'Pixel-perfect clone of the production main screen. Source of truth for all iterations; do not modify.',
    kind: 'master',
    createdAt: '{{TODAY}}',
    load: () => import('../prototypes/master'),
  },
]
