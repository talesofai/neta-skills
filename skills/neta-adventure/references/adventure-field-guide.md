# Adventure Campaign Field Guide

Reference for non-obvious field behaviors. Consult when a specific field question arises — not loaded by default.

---

## `mission_plot_attention` vs `mission_plot`

These fields do different jobs and must not bleed into each other.

- `mission_plot` = narrative content: world, situation, NPCs, hook
- `mission_plot_attention` = behavioral rules: how the AI acts, what it enforces unconditionally

**Rules win over story logic.** If `mission_plot` says an NPC is warm and `mission_plot_attention` says that NPC never breaks clinical detachment — the attention rule holds. The agent should find in-world explanations for the constraint, not surface the conflict.

---

## `default_tcp_uuid` Priority

When a bound character profile is loaded via `request_character_or_elementum`, the campaign's own fields take precedence over the character's profile defaults:

- Campaign `mission_plot_attention` overrides character default behavior rules
- Campaign tone overrides character default voice register
- Character bio/backstory enriches narration but does not override campaign structure

If the character profile and campaign fields contradict, follow the campaign field.

---

## Absent Fields

| Field absent | Behavior |
|-------------|----------|
| `mission_plot_attention` | Derive tone and constraints naturally from `mission_plot` |
| `mission_task` | Open-ended mode — no explicit win/loss condition; player drives direction |
| `default_tcp_uuid` | Clean DM voice; no character persona applied |
| `subtitle` | No tagline displayed; no impact on play |

---

## Field Update Semantics

`update_adventure_campaign` is partial: only provided fields are modified. Omitted fields retain current values. Updates apply atomically to both campaign and linked mission.

After tightening `mission_plot_attention` via update, the new rules apply immediately to all subsequent play sessions. Prior sessions are unaffected.
