import { Suspense, lazy, useMemo } from 'react'
import type { PrototypeEntry } from './registry'
import { prototypes } from './registry'

export function PrototypeChrome({ entry }: { entry: PrototypeEntry }) {
  const index = prototypes.indexOf(entry)
  const prev = prototypes[(index - 1 + prototypes.length) % prototypes.length]
  const next = prototypes[(index + 1) % prototypes.length]
  const Prototype = useMemo(() => lazy(entry.load), [entry])
  return (
    <div className="pg-chrome">
      <header className="pg-chrome-bar">
        <a className="pg-chrome-back" href="#/">
          ← All prototypes
        </a>
        <div className="pg-chrome-title">
          <strong>{entry.name}</strong>
          {entry.kind === 'master' && <span className="pg-badge">master</span>}
        </div>
        <nav className="pg-chrome-nav">
          <a href={`#/${prev.slug}`} title={prev.name}>
            ‹ Prev
          </a>
          <span className="pg-chrome-count">
            {index + 1} / {prototypes.length}
          </span>
          <a href={`#/${next.slug}`} title={next.name}>
            Next ›
          </a>
        </nav>
      </header>
      <main className="pg-chrome-stage">
        <Suspense fallback={null}>
          <Prototype />
        </Suspense>
      </main>
    </div>
  )
}
