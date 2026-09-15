# Troubleshooting

## Error codes

Every refusal from `generate` comes back as `{ ok: false, code, error, status }` and the MCP reply
is marked `isError: true`. Act on the **`code`**; `error` is the human sentence to relay, `status` the
HTTP status behind it. A failed generation is never charged.

| `code` | What happened | What to do |
|---|---|---|
| `bad-request` | The arguments were malformed. | Fix the arguments. Never resend them unchanged. |
| `unknown-model` | The model id is not runnable on this account. | Re-read `gateway_models` and take an id from it. |
| `clamp` | A setting that changes the price (per-second `duration`, an audio price tier) is outside what this model supports. | Leave that key out of `input`, or use a value the message names. |
| `plan` | The model is not on the user's plan. | Pick another model in the same category from `gateway_models`. |
| `cost-guard` | rendrr's per-run cost guard blocked an unusually expensive request. | Lower duration or resolution, or choose a lighter model. |
| `spend-cap` | The platform-wide daily spend cap is reached. | Tell the user and stop; it resets daily. |
| `rate-limit` | More than 30 generations in one minute. | Wait a minute, then retry once. |
| `credits` | The user's balance is too low for this run. | Tell the user what it costs and point at `https://app.rendrr.ai/billing`. Do not retry, do not swap to a cheaper model unasked. |
| `inflight` | Another generation of this user is still running. | Wait for it to finish, then retry once. Run generations one at a time. |
| `needs-confirm` | Rare: a fallback model is offered at a quoted price instead of switching automatically. | STOP. Show the user the model and the credits; resend with `confirmFallback: true` only on a yes. |
| `refused` | The provider's filter declined the prompt or a reference. | Rephrase away from the trigger or change the reference (see below). Never retry unchanged. |
| `provider-credits` | The upstream provider account is out of funds — not the user's balance. | Switch to another model in the same category and say so. |
| `provider-limit` | The upstream provider is throttling or its own cap is hit. | Switch models, or retry later. |
| `too-large` | A source file is over the size limit. | Use a smaller file; the message names the limit. |
| `provider-error` | The provider failed. | Retry once; if it fails again, switch models and say so. |
| `internal` | rendrr itself failed; the error is logged. | Retry once; then stop and tell the user. |

Two protocol-level refusals arrive as JSON-RPC errors instead of a tool result:

- **`-32003` / `plan-required`** — the account is signed in but the plan does not include MCP. MCP
  access starts at the **Expert** plan. Tell the user plainly and point at
  `https://app.rendrr.ai/billing`. Nothing to retry.
- **`-32004` / `tool-forbidden`** — the tool exists but not for this account. Do not retry and do not
  try a variant name. Solve the request with the customer tools: `gateway_models`, `list_models`,
  `generate`, `credits`, `enhance`, `recipes`, `library`, `library_save`, `library_update`, `list_characters`,
  `presets`, `templates`, `flows`, `flow_get`, `flow_save`, `accounts`, `posts`, `post_draft`,
  `post_update`.

## Connection and access

**No rendrr MCP tools in the session.** rendrr is not connected. Give the user the connect step:
claude.ai / Claude Desktop → Settings → Connectors → *Add custom connector* with URL
`https://mcp.rendrr.ai/mcp` (Google sign-in, no API key); Claude Code →
`claude mcp add --transport http rendrr https://mcp.rendrr.ai/mcp`. Do not attempt a workaround
and do not guess at an HTTP endpoint.

**Unauthorized / the client asks to sign in again.** The access token expired. Reconnect through the
same connector flow; there is no token to paste manually.

**A tool you expected is missing.** MCP clients cache the tool list at connect time. After rendrr adds
a tool, the user reconnects the connector once to see it.

## Model selection

**`unknown-model`.** Almost always an id taken from `list_models` (the wide third-party research
catalog) instead of `gateway_models` (what this account can actually run). Re-read `gateway_models`
and pick from it.

**A model from an earlier session is gone.** The catalog is server-side and changes. Never reuse an
id carried over from a previous session; always take ids from the current `gateway_models` call.

## Generation failures

**`refused`.** Some prompts are declined by the provider's safety filter. Rephrase away from the
trigger: named real people, recognisable brands and trademarked characters, and explicit content are
the usual causes. If the user insists on a real person's likeness, say it will not work rather than
trying synonyms.

**The result says `switched`.** When a model refuses a photoreal start frame (Seedance's person
filter) or its direct route is down, rendrr runs a fallback model by itself. The reply carries
`switched: { from, to, reason }` and the charge never exceeds the credits quoted for the model that
was picked. Tell the user in one line which model actually ran.

The person-filter fallback keeps the face from the START FRAME and strips every reference, so a
character sheet no longer travels. When identity matters more than the frame, move the approved still
into `image_urls` as the last reference instead and say "open on reference image N" in the prompt.

## Results that come back wrong

**The response carries a `note` about adjusted settings.** The server snapped an unsupported value to
the nearest supported one (resolution, duration, aspect ratio, size, copies) or dropped a setting the
model does not read. This is informational — surface it in one short line, and use the corrected value
in follow-up generations.

**The edit ignored the source image.** Check the model's `edit` flag in `gateway_models` — a
text-to-image-only model silently ignores `image_url`. Pick one where `edit` is true.

**A reference URL could not be fetched.** Every URL in `image_url` / `image_urls` must be publicly
reachable over https. Local file paths and private links do not work, and there is no upload tool on
this surface — ask the user for a hosted URL, or generate the reference first and reuse the URL that
comes back.

**The result drifted from the reference.** Too many references in conflict, or a prompt that
re-describes what the reference already shows. Cut to two or three references, and let the prompt
describe only the change. See `prompt-guide.md`.

## Prompt enhancement

**`enhance` returns an error about a missing instruction.** `kind: "revise"` requires the
`instruction` argument — that is the whole point of that mode.

**`enhance` is unavailable.** The enhancer is a server-side convenience and can be temporarily
off. It is optional: write the prompt yourself using `prompt-guide.md` and continue to `generate`.
