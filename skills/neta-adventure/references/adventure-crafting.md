# Adventure Campaign Crafting Guide

Craft mode: translate any concept seed into a complete, playable campaign. Default behavior is draft-first — generate immediately, refine surgically.

---

## Reading the Room

Calibrate to the user's mode from signals, not meta-questions.

| Signal | Mode | Agent behavior |
|--------|------|----------------|
| Short concept drop, "just make it", no detail | **Express** | Agent drives — generate full draft immediately |
| Partial details, hedging language, "something like…" | **Collaborative** | Co-build — draft with labeled assumptions, invite reaction |
| Pre-filled fields in natural language | **Expert** | Format + light polish only, no added invention |

**Default: Express.** One draft beats ten questions.

---

## The Draft-First Loop

1. User gives any concept seed — one word is enough.
2. Agent generates ALL five fields immediately, labels assumptions inline.
3. Present as readable prose, not JSON. Include a brief "I assumed X" note.
4. User reacts → agent refines only the changed fields. No wholesale rewrites.
5. One explicit confirm → call `create_adventure_campaign`.

**Edge cases**
- Mid-conversation pivot → synthesize from conversation history, generate a new draft immediately.
- User disagrees with multiple fields → ask one orienting question, then regenerate the whole draft.
- User provides a full brief → formatting + light polish only, no added invention.

---

## Five Fields as a Coherent System

Before generating, consult `adventure-examples.md` for range across genres.

### `mission_plot` — What IS
Write like an opening paragraph, not a summary. The world, the situation, the hook. Start mid-wrong — something is already broken. The first sentence is the first thing the AI experiences; it sets atmosphere for the entire session.

Strong: *"The overnight security log ends mid-sentence. Not at the end of a shift — mid-sentence."*
Weak: *"You are an explorer who has arrived in a mysterious place."*

### `mission_task` — What to DO
The player's active stake. Specific enough to generate decisions, open enough to allow multiple approaches. Visible to the player. Do not script the path — set the goal.

### `mission_plot_attention` — The AI's Operating Rules
3–6 rules that govern **how the AI behaves**, not what happens in the story. Covers tone, NPC behavioral contracts, information gating, consequence rules, content guardrails. These override all other context unconditionally.

**Anti-pattern**: Do not put worldbuilding or plot events here — those belong in `mission_plot`.

Strong attention example:
```
Maintain psychological horror — dread and implication over explicit content.
Player agency is sacred: never force actions or choose for them.
All revelations must be player-earned through investigation or persuasion.
Victoria (bound character) has her own agenda; she informs but never solves.
Avoid: graphic violence, sexual content, breaking the fourth wall.
```

### `name` + `subtitle`
Evocative, short, slightly ambiguous. The name should hint at genre without explaining it.

### Field coherence check
If `mission_plot` is a paranoid thriller, `mission_plot_attention` should enforce paranoid-thriller behavior. If plot is lighthearted, attention rules should match. Mismatched fields produce drifting sessions.

---

## After Creation

Call `request_adventure_campaign` immediately to confirm fields are stored correctly — especially `mission_plot_attention`, which governs all future play sessions.

After the first playtest, note where the AI drifted; use `update_adventure_campaign` to tighten `mission_plot_attention` at those points.

---

## Quality Checklist

- [ ] Does the first sentence of `mission_plot` drop the reader mid-wrong, with no preamble?
- [ ] Does the player know their goal but not exactly how to reach it?
- [ ] Does `mission_plot_attention` cover the 3 most likely immersion-break vectors?
- [ ] Is every named NPC distinct enough that their dialogue couldn't be swapped?
- [ ] Is `mission_plot_attention` free of worldbuilding content?
