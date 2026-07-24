import type { AgentTransport } from './transport'

/**
 * Scripted agent: plays fixture-defined conversations with realistic pacing
 * (chunked streaming, thinking pauses, tool-call delays). Deterministic, works
 * offline and on static deploys — the default agent for every prototype.
 * Prototypes need believable motion, not intelligence.
 */
export interface ToolStep {
  name: string
  input: unknown
  output: unknown
  durationMs?: number
}

export interface ScriptStep {
  thinking?: string
  tool?: ToolStep
  reply?: string
}

export interface AgentScript {
  id: string
  /** Tested against the latest user message; first matching script plays. */
  match?: RegExp
  steps: ScriptStep[]
}

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms)
    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(timer)
        reject(new DOMException('aborted', 'AbortError'))
      },
      { once: true },
    )
  })
}

function wordChunks(text: string): string[] {
  return text.match(/\S+\s*/g) ?? []
}

export function createScriptedTransport(
  scripts: AgentScript[],
  fallback: AgentScript,
): AgentTransport {
  return {
    async send(messages, onEvent, signal) {
      const lastUser =
        [...messages].reverse().find((m) => m.role === 'user')?.content ?? ''
      const script = scripts.find((s) => s.match?.test(lastUser)) ?? fallback
      try {
        for (const step of script.steps) {
          if (step.thinking) {
            onEvent({ type: 'thinking', text: step.thinking })
            await sleep(700, signal)
          }
          if (step.tool) {
            onEvent({ type: 'tool-call', name: step.tool.name, input: step.tool.input })
            await sleep(step.tool.durationMs ?? 900, signal)
            onEvent({ type: 'tool-result', name: step.tool.name, output: step.tool.output })
          }
          if (step.reply) {
            for (const chunk of wordChunks(step.reply)) {
              onEvent({ type: 'text-delta', text: chunk })
              await sleep(35, signal)
            }
          }
        }
        onEvent({ type: 'done' })
      } catch (error) {
        if (signal?.aborted) return
        onEvent({
          type: 'error',
          message: error instanceof Error ? error.message : String(error),
        })
      }
    },
  }
}
