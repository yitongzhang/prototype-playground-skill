# Prototype Playground Setup

Turn any app's codebase into a **playground for trying design ideas** — a
private sandbox where you can ask an AI agent to redesign screens, try new
layouts, and explore directions, and *see them running instantly* without
touching the real product.

Think of it like getting a working copy of your app on a design table: you
can repaint it, rearrange it, and try ten versions side by side, and nothing
you do can break the real thing.

## Quick start

**Step 1 — install it** (one command; works with Claude Code, Codex, Cursor,
and others, auto-detected):

```bash
npx skills add yitongzhang/prototype-playground-setup
```

**Step 2 — open your AI coding agent inside the app's codebase and say:**

> Set up a prototype playground for this repo.

The agent does the rest — it studies the app and builds you the playground.
When it's done, it'll tell you how to open it in your browser. That's the
whole setup; from then on you just talk to the agent.

## What you get

The agent builds you a small, self-contained version of your app with four
things already done for you:

- **The look, cleaned up.** It pulls out your product's real design — the
  colors, fonts, spacing, buttons, icons — and organizes them into one tidy
  set. Everything you prototype automatically looks like your actual product,
  not a generic template.

- **Fake data that looks real.** The playground is filled with realistic
  made-up content (names, tasks, messages — whatever your app shows) so
  screens look alive. It's all in one simple file you can ask the agent to
  change ("add more items," "make the titles longer") — no databases, no
  logins, no real customer data involved.

- **A faithful copy of your main screen.** The agent recreates your app's
  main screen so it matches the real thing closely, and makes the obvious
  clicks work. This is your **starting point** — the "before" that every new
  idea gets compared against.

- **A little app to browse it all.** A simple home screen lists every version
  you've made, like pages in a design file. Click into any one to see it
  full-screen, and flip between them to compare.

It all runs on your own computer, privately. Nothing connects to your real
product, your servers, or your users.

## How to work in the playground

A few things worth knowing to get the most out of it:

- **The "master" is your reference — leave it alone.** That first faithful
  copy of your app is the baseline. You don't edit it; you branch off it.
  It's always there as the "this is how it looks today" anchor.

- **Every new idea is a new version.** When you say *"try a version where the
  menu is on the left"* or *"make it feel more playful,"* the agent creates a
  fresh page for that idea and leaves everything else untouched. Nothing you
  try overwrites anything else, so you can be fearless.

- **Ask for many at once.** *"Give me six versions with six different
  navigation styles"* gives you six pages to compare on the home screen. This
  is the real superpower — exploring lots of directions cheaply and seeing
  them all next to each other.

- **Talk in plain product language.** You don't need to know how any of it is
  built. Describe what you want the way you'd describe it to a designer —
  *"the sidebar feels cramped,"* *"try warmer colors,"* *"what if tasks were
  cards instead of a list?"* — and the agent knows where that belongs.

- **Refine a version by pointing at it.** *"Keep going on the card one, but
  bigger images"* tells the agent to keep working on that specific page.

Good loop: look at what you have on the home screen → pick a direction to
explore → ask for a few versions of it → compare → refine the winner → repeat.

## A note on quality

This works best with a capable, up-to-date AI model — recreating a design
faithfully and matching your product's style takes a sharp eye. Give it a
little back-and-forth and it gets better the more specific you are about what
you want.
