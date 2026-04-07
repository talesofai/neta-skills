---
name: neta-me
description: Neta API user skill — manage your own identity, credits, and personal assets (profile, AP balance, stories, artifacts). Use this skill when the user asks about "my account", "my stories", "my pictures", "my AP", or anything related to their own Neta identity and creations.
---

# Neta Me Skill

Self-service dashboard for the current Neta user. Provides access to identity, credit balance/history, and personal content assets (stories and artifacts).

## When to use

- The user asks about **their own** profile, account, or identity
- The user asks about **AP balance**, credit usage, or daily limits
- The user wants to **list their own stories/collections** or **artifacts**
- The user wants to **update profile info** (nickname, bio, avatar)
- You need to establish or clear a **logged-in CLI session** via OAuth device flow

## Authorization

Use this when the user needs a **logged-in Neta identity** for CLI-backed flows and no valid session exists (or you would otherwise rely on `NETA_TOKEN`).

1. **Start the flow**: run **`neta login`** (default action is `request-code`).
```bash
npx -y @talesofai/neta-skills@latest login --action request-code
```
This begins the OAuth **device authorization** flow stored by the CLI.

2. **Browser step**: When the command returns device-authorization fields, show the user **`verification_uri_complete`** (the ready-to-open URL), tell them to open it in a browser and finish sign-in/consent there, then **return to the chat and explicitly say the browser step is done** so you know when to continue.

3. **Complete login**: After they confirm in chat, run **`neta login --action verify-code`** to exchange the device code for tokens. On success, show the returned **account basics**: **`uuid`** (long user id), **`nick_name`**, and **`avatar_url`**.
```bash
npx -y @talesofai/neta-skills@latest login --action verify-code
```

4. **Logout**: run `neta logout` to clear stored tokens.
```bash
npx -y @talesofai/neta-skills@latest logout
```

## Commands

### Profile and credits

**Get your profile**

```bash
npx -y @talesofai/neta-skills@latest get_profile
```

Returns `uuid`, `nick_name`, `avatar_url`, AP summary, and asset totals.

**Get AP balance**

```bash
npx -y @talesofai/neta-skills@latest get_ap_info
```

**Get AP history / consumption log**

```bash
npx -y @talesofai/neta-skills@latest get_ap_history --page_size 10
```

**Update profile**

```bash
npx -y @talesofai/neta-skills@latest update_profile --nick_name "New Name"
```

📖 [Detailed guide](./references/profile-and-credits.md)

### Personal assets

**List your stories**

```bash
npx -y @talesofai/neta-skills@latest list_my_stories --page_size 10
```

**List your artifacts**

```bash
npx -y @talesofai/neta-skills@latest list_my_artifacts --page_size 10 --modality PICTURE
```

📖 [Detailed guide](./references/assets.md)

## Cross-skill references

| Task | Skill to use |
|------|--------------|
| Like, favorite, or comment on a story | `neta-community` (`like_collection`, `favor_collection`, `create_comment`) |
| Publish a new story / collection | `neta-creative` (`publish_collection`) |
| Browse community feeds | `neta-community` (`fetch_feed`) |
| Manage characters or elementum | `neta-character` / `neta-elementum` (or `list_my_characters` / `list_my_elementum`) |

## Reference Documents

| Scenario | Document |
|----------|----------|
| 👤 Profile, AP, login/logout | [profile-and-credits.md](./references/profile-and-credits.md) |
| 🖼️ Stories and artifacts | [assets.md](./references/assets.md) |
