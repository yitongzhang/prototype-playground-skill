import type { AgentTransport } from './transport'

/**
 * Live agent over GitHub Models — free for every GitHub account (PAT with
 * models:read), OpenAI-compatible, rate-limited enough for prototyping only.
 *
 * Dev-only by construction: requests go through the Vite dev proxy at
 * /github-models (see vite.config.ts), which injects the token from
 * .env.local. The token never reaches client code, and production builds have
 * no proxy — deployed playgrounds fall back to the scripted transport.
 */
export function createGitHubModelsTransport(
  options: { model?: string; system?: string } = {},
): AgentTransport {
  const model = options.model ?? 'openai/gpt-4.1-mini'
  return {
    async send(messages, onEvent, signal) {
      try {
        const response = await fetch('/github-models/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model,
            stream: true,
            messages: [
              ...(options.system ? [{ role: 'system', content: options.system }] : []),
              ...messages,
            ],
          }),
          signal,
        })
        if (!response.ok || !response.body) {
          onEvent({
            type: 'error',
            message: `GitHub Models unavailable (HTTP ${response.status}). Run the dev server with GITHUB_MODELS_TOKEN set in .env.local, or use the scripted agent.`,
          })
          return
        }
        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''
        for (;;) {
          const { done, value } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() ?? ''
          for (const line of lines) {
            if (!line.startsWith('data:')) continue
            const data = line.slice(5).trim()
            if (!data || data === '[DONE]') continue
            try {
              const delta: unknown = JSON.parse(data)
              const text = (delta as { choices?: { delta?: { content?: string } }[] })
                .choices?.[0]?.delta?.content
              if (text) onEvent({ type: 'text-delta', text })
            } catch {
              // Incomplete SSE frame; the remainder arrives with the next read.
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
