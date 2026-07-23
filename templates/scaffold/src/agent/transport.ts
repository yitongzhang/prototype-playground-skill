/**
 * The one interface every fake or live agent implements. Prototypes render
 * from these events; swapping scripted ↔ live model never touches UI code.
 */
export type AgentEvent =
  | { type: 'thinking'; text: string }
  | { type: 'text-delta'; text: string }
  | { type: 'tool-call'; name: string; input: unknown }
  | { type: 'tool-result'; name: string; output: unknown }
  | { type: 'done' }
  | { type: 'error'; message: string }

export interface AgentMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface AgentTransport {
  send(
    messages: AgentMessage[],
    onEvent: (event: AgentEvent) => void,
    signal?: AbortSignal,
  ): Promise<void>
}
