# Agent Prototyping

How to prototype agent/chat surfaces in a playground: an assistant panel, an
agent session view, a chat with streaming, thinking states, and tool-call
cards. Principle: **prototypes need believable motion, not intelligence** —
what is being design-tested is choreography (streaming feel, tool-card
placement, thinking collapse), so a deterministic fake is the default and a
real model is an optional upgrade.

No agent framework, ever. Frameworks earn their weight with real tools,
memory, and server orchestration; a prototype's tools are fake, its memory is
fixtures, and there is no server. The whole runtime is the ~150-line
`src/agent/` module already in the scaffold.

## The transport layer (already in the scaffold)

`src/agent/` ships with every playground:

- `transport.ts` — the one interface: `send(messages, onEvent, signal)`
  emitting `thinking` / `text-delta` / `tool-call` / `tool-result` / `done` /
  `error` events. UI renders from events; transports are swappable.
- `scripted.ts` + `scripts.ts` — the **default**: fixture-defined
  conversations played with realistic pacing (word-chunk streaming, thinking
  pauses, tool delays). Deterministic, offline, works on deployed static
  builds. During setup, replace the example scripts with 2–4 scripts in the
  product's domain, using fixture data in the replies so the agent and the
  UI tell one coherent story.
- `github-models.ts` — the **live option**: GitHub Models, free for every
  GitHub account, OpenAI-compatible, streaming. The user creates a PAT with
  only the `models:read` permission, puts `GITHUB_MODELS_TOKEN=…` in
  `.env.local`, and restarts `npm run dev`. The Vite proxy
  (`vite.config.ts`) injects the token server-side — it never enters the
  bundle, and deployed builds have no proxy, so published playgrounds
  automatically fall back to scripted.

Live-mode constraints worth knowing: free tier is roughly 10–15
requests/minute and 50–450/day depending on model class, with an **8K-token
input cap** — inject a summary of the fixtures into the system prompt, not
the whole dataset. Default model `openai/gpt-4.1-mini` is the right
speed/quality for prototypes; any catalog model id works.

## The chat UI: harvest shadcn, restyle to the product

Do not build message lists, scroll anchoring, or streaming markdown from
scratch, and do not use embedded chat widgets (ChatKit-style iframes) that
cannot be restyled to pixel fidelity. shadcn/ui ships purpose-built chat
components (June 2026):

```bash
npx shadcn@latest add message-scroller message bubble attachment marker
```

- `message-scroller` — the hard one: anchored turns, streamed replies,
  saved-thread restore, prepended history, jump-to-message, scroll controls.
- `message` / `bubble` — conversation rows and message surfaces.
- `attachment` — files/images with upload states.
- `marker` — status rows for streaming state, tool activity, date breaks.
- `shimmer` / `scroll-fade` CSS utilities for "Thinking…" text and edge fades.

The scaffold is pre-wired for the CLI: `components.json` lands components in
`src/design-system/components/ui/`, the `@` alias and `cn` helper exist. Then
apply the harvest rule from
[design-system-extraction.md](design-system-extraction.md) §4: keep the
behavior, replace the styling with the product's. Map every visual decision
(bubble radius, gutter, type ramp, tool-card borders) to extracted tokens; if
the source app already has a chat surface, its code/screenshots are the
styling truth. **Stock-shadcn-looking chat in a prototype is a bug** — it
reads as a template, not as the product.

## Wiring a chat prototype

1. Build the chat surface in the iteration from the harvested, restyled
   components.
2. Hold conversation state in the iteration (or a `src/data/` hook if shared
   across iterations); append `AgentEvent`s into renderable message parts.
3. Default to `scriptedAgent` from `src/agent`. Offer live mode only if the
   user asks to "actually talk to it": have them create the PAT — do not
   create or handle credentials for them — then swap
   `createGitHubModelsTransport({ system })` in one line.
4. Give the scripted agent one script per demo moment the user cares about,
   and keep the fallback reply honest about being scripted.
