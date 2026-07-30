# Troubleshooting

## Connection and access

**No `genai_*` tools in the session.** rendrr is not connected. Give the user the connect step:
claude.ai / Claude Desktop → Settings → Connectors → *Add custom connector* with URL
`https://mcp.rendrr.ai/mcp` (Google sign-in, no API key); Claude Code →
`claude mcp add --transport http rendrr https://mcp.rendrr.ai/mcp`. Do not attempt a workaround
and do not guess at an HTTP endpoint.

**`-32003` / `plan-required`.** The account is signed in but the plan does not include MCP. MCP
access starts at the **Pro** plan. Tell the user plainly and point them at
`https://app.rendrr.ai/billing`. Nothing to retry.

**`-32004` / `tool-forbidden`.** The tool exists on the server but not for this account — it is an
owner-only tool. Do not retry and do not try a variant name. Solve the user's request with the
customer tools: `genai_gateway_models`, `genai_list_models`, `genai_free`, `genai_enhance`,
`genai_library`, `genai_list_characters`, `genai_list_presets`, `genai_list_templates`.

**Unauthorized / the client asks to sign in again.** The access token expired. Reconnect through the
same connector flow; there is no token to paste manually.

**Rate limited.** Too many requests in a short window. Wait a moment and retry once. If it persists,
say so rather than looping.

## Model selection

**"unknown free model".** The `model` id is not runnable on this surface. Almost always the cause is
an id taken from `genai_list_models` (the wide third-party research catalog) instead of
`genai_gateway_models` (what this account can actually run). Re-read `genai_gateway_models` and pick
from it.

**"This model isn't available on your plan."** The id exists but is gated for this account. Pick a
different model from the live list in the same category — do not retry the same id.

**A model from an earlier session is gone.** The catalog is server-side and changes. Never reuse an
id carried over from a previous session; always take ids from the current `genai_gateway_models` call.

## Generation failures

**The generation failed / no output returned.** Retry once — transient provider failures are common
and a failed generation is not charged. If the second attempt fails too, switch to another model in
the same category from the live list and tell the user you changed model. Do not retry a third time
on the same model.

**Content was refused.** Some prompts are declined by the provider's safety filter. Rephrase away
from the trigger: named real people, recognisable brands and trademarked characters, and explicit
content are the usual causes. If the user insists on a real person's likeness, say it will not work
rather than trying synonyms.

**A start frame is refused as a real person.** Some video models refuse photos that look like a real
identifiable person. This is a hard provider policy, not a transient error. Switch to another video
model from the live list, or start from a generated (non-photographic-source) frame.

**Not enough credits.** The account balance is short for this generation. Tell the user, name the
rough cost if the error carries one, and point at `https://app.rendrr.ai/billing`. Do not retry with a
cheaper model unless the user asks you to.

**"Too many generations".** A short-window pacing limit. Wait and retry once.

**A cost-control block.** An unusually expensive request (very long or very high resolution video) can
be refused by rendrr's own cost guard. Reduce duration or resolution, or choose a lighter model.

## Results that come back wrong

**The response carries a `note` about adjusted settings.** The server snapped an unsupported value to
the nearest supported one (resolution, duration, aspect ratio, size, copies) or dropped a setting the
model does not read. This is informational — surface it in one short line, and use the corrected value
in follow-up generations.

**An error instead of an adjustment.** Two settings refuse to be silently corrected because dropping
them would change what the user is charged: `duration` on models billed per second, and
`generate_audio` on models where audio is a price tier. Leave those keys out of `input` entirely
rather than sending a value you are unsure of.

**The edit ignored the source image.** Check the model's `edit` flag in `genai_gateway_models` — a
text-to-image-only model silently ignores `image_url`. Pick one where `edit` is true.

**A reference URL could not be fetched.** Every URL in `image_url` / `image_urls` must be publicly
reachable over https. Local file paths and private links do not work, and there is no upload tool on
this surface — ask the user for a hosted URL, or generate the reference first and reuse the URL that
comes back.

**The result drifted from the reference.** Too many references in conflict, or a prompt that
re-describes what the reference already shows. Cut to two or three references, and let the prompt
describe only the change. See `prompt-guide.md`.

## Prompt enhancement

**`genai_enhance` returns an error about a missing instruction.** `kind: "revise"` requires the
`instruction` argument — that is the whole point of that mode.

**`genai_enhance` is unavailable.** The enhancer is a server-side convenience and can be temporarily
off. It is optional: write the prompt yourself using `prompt-guide.md` and continue to `genai_free`.
