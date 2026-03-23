# Premium subscription (CLI)

These commands list subscription options, create and inspect orders, and start checkout through the payment provider. Use the published `neta-skills` CLI; you do not need to call backend services directly.

---

## Recommended workflow

```text
0. (Optional) get_current_premium_plan — baseline before upgrade
1. list_premium_plans → 2. choose plan identifier (monthly or yearly) → 3. create_premium_order
→ 4. pay_premium_order (stripe-checkout) → 5. open checkout_session_url in a browser
6. get_current_premium_plan — confirm the new tier after the subscription updates
```

After payment, completion follows the normal in-product subscription flow; the account may take a short time to reflect the new tier—retry **`get_current_premium_plan`** if needed.

---

## Commands (summary)

| Command | Role |
|--------|------|
| `get_current_premium_plan` | Returns **`plan`** (current tier) and **`until`** (subscription end, or null). Use **before and after** upgrading to confirm the active scheme. |
| `list_premium_plans` | Returns `plans`: pricing and per‑tier identifiers for checkout. |
| `create_premium_order` | Creates an order for the chosen plan. Returns an `order` object (status, times as ISO 8601). |
| `get_premium_order` | Loads one order by its UUID. |
| `list_premium_orders` | Lists your orders with pagination (`page_index` ≥ 0, `page_size` 1–50, default 20). |
| `pay_premium_order` | For **unpaid**, non‑expired orders: starts **Stripe Checkout** and returns `checkout_session_url` and `checkout_session_id`. |

**CLI note:** If you see a misspelled filename in the package sources, the command you run is still **`pay_premium_order`** (as registered by the tool).

---

## Order status

CLI output includes a `status` field. Typical values:

- **`UNPAID`** — you can run `pay_premium_order` if the order is still within its validity window (`valid_until`).
- **`PAID`**, **`COMPLETED`**, **`CLOSED`** — not eligible for this pay step.

`pay_premium_order` fails if the order is not `UNPAID`, if it has expired, or if the environment is unsupported.

---

## Payment channel

- Use **`channel`**: `stripe-checkout` (the option exposed by the CLI today).

---

## Examples

```bash
# Confirm current tier (before / after an upgrade)
npx -y @talesofai/neta-skills@latest get_current_premium_plan

# Inspect available tiers and plan ids
npx -y @talesofai/neta-skills@latest list_premium_plans

# Start checkout for a new order
npx -y @talesofai/neta-skills@latest create_premium_order --spu_uuid "<id-from-plans>"
npx -y @talesofai/neta-skills@latest pay_premium_order --order_uuid "<order-uuid>" --channel "stripe-checkout"

# Review existing orders
npx -y @talesofai/neta-skills@latest list_premium_orders --page_index 0 --page_size 20
npx -y @talesofai/neta-skills@latest get_premium_order --order_uuid "<order-uuid>"
```
