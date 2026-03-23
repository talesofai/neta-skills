---
"@talesofai/neta-skills": minor
---

feat(premium): implement premium subscription commands and integrate dayjs for date handling

- Add premium subscription CLI commands: `create_premium_order`, `pay_premium_order`, `get_current_premium_plan`, `get_premium_order`, `list_premium_orders`, `list_premium_plans`; wire commerce APIs and command loading.
- Add `dayjs` and `src/utils/date.ts` for date formatting/parsing; adjust `parse_meta` as needed.
- Update `README.md` and `skills/neta-creative/SKILL.md`; add `skills/neta-creative/references/premium.md` for premium workflows.
