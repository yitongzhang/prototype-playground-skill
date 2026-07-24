import { createScriptedTransport } from './scripted'
import type { AgentScript } from './scripted'

/**
 * The agent's scripted conversations — edit these like fixtures. Replaced
 * during playground setup with scripts that fit the product's domain, shaped
 * like real runs (thinking → tool calls → reply). Add a script per demo
 * moment you want to be able to show deterministically.
 */
const scripts: AgentScript[] = [
  {
    id: 'status-overview',
    match: /summar|overview|status|today/i,
    steps: [
      { thinking: 'Looking at the current items…' },
      {
        tool: {
          name: 'list_items',
          input: { limit: 20 },
          output: { open: 8, dueThisWeek: 3 },
        },
      },
      {
        reply:
          'You have 8 open items, 3 due this week. The launch checklist is closest — due Thursday. Want me to draft a plan for it?',
      },
    ],
  },
]

const fallback: AgentScript = {
  id: 'fallback',
  steps: [
    { thinking: 'Considering that…' },
    {
      reply:
        'Good question — in this prototype I only know scripted answers. Add a script for this in src/agent/scripts.ts to teach me the reply.',
    },
  ],
}

export const scriptedAgent = createScriptedTransport(scripts, fallback)
