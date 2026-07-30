---
name: rendrr-characters
description: >-
  Reuse an existing rendrr.ai character across new generations so the same face,
  build and styling stay recognisable. Use when: "use my character", "put
  <name> in this scene", "same person as last time", "keep the face consistent",
  "my AI influencer", "consistent character across images", "character sheet",
  "which characters do I have", "generate a new photo of <character>", "make a
  video with my avatar". NOT for: one-off generations with no recurring
  identity, or general image/video/audio work — use rendrr-generate for that.
---

# rendrr Characters

Consistency work: take a character that already exists in the user's rendrr account and put it in a
new image or video without losing the face.

## Step 0 — Connect

Check whether the `genai_*` tools are present in this session. If they are, continue. If not, stop
and give the user the connect step:

- **claude.ai / Claude Desktop** — Settings → Connectors → *Add custom connector*, URL
  `https://mcp.rendrr.ai/mcp`. Sign-in is Google; there is no API key to paste.
- **Claude Code** — `claude mcp add --transport http rendrr https://mcp.rendrr.ai/mcp`

MCP access requires a **Pro plan or higher** on rendrr.ai.

## UX rules

Same as `rendrr-generate`: be brief, deliver the media URL plus one line, never dump JSON or ids,
reply in the user's language, ask at most one question, and never invent a character, a model or a
parameter that a tool did not return.

## Step 1 — Read the roster

Call **`genai_list_characters`** (no arguments). Each entry can carry:

| Field | Use |
|---|---|
| `name` | how the user refers to this character |
| `identity` | a short English identity descriptor — **the phrasing to reuse verbatim** |
| `prompt` | the fuller base description the character was built from |
| `sheet` | the character reference sheet: the strongest identity reference |
| `image` | the base portrait |
| `closeup` | macro close-up — fine facial detail |
| `bodySheet` | headless body/outfit reference |
| `refImage` | the source photo, for reference-based characters |
| `traits` | the structured attribute selection, when the character was built in the wizard |

Match the user's wording to a `name`. If nothing matches, say which characters do exist rather than
guessing at the nearest one.

## Step 2 — Generate with the character as reference

Reusing a character is an **edit-style generation**: pick a model from `genai_gateway_models` whose
`edit` flag is `true` (it accepts source images), then hand it the character's own images as
references while the prompt carries the identity wording and the new scene.

```json
{ "name": "genai_free",
  "arguments": {
    "model": "<edit-capable id from genai_gateway_models>",
    "prompt": "<identity phrasing, verbatim from the character>, <new scene, pose, lighting, framing>",
    "input": { "image_urls": ["<character.sheet>", "<character.closeup>"],
               "image_size": "portrait_4_3" }
  } }
```

For video, use a video model that accepts references: put the character's sheet in `image_urls`, and
a start frame — usually an image you just generated of this character — in `image_url`.

Rules that decide whether the face survives:

1. **Always attach the sheet.** `sheet` first; add `closeup` when facial detail matters, `bodySheet`
   when the outfit or build matters. Two to three references, not five.
2. **Keep `identity` verbatim.** Do not paraphrase, translate or "improve" it. That exact wording is
   what pins the face across generations.
3. **Describe only the new scene** on top of it — setting, action, lighting, camera. Do not
   re-describe the face; the references handle appearance and a second description competes with them.
4. **One change per generation.** New setting *or* new outfit *or* new age/mood, not three at once.

Deeper guidance, including what to do when the likeness drifts: `references/consistency-guide.md`.

## Creating a character

Character creation lives in the **rendrr app**, not on this tool surface — the Characters studio
(app.rendrr.ai → Characters) runs the builder and generates the reference sheet that makes a
character reusable.

So when the user wants a *new* character:

1. Say plainly that creation happens in the Characters studio at `https://app.rendrr.ai/influencer`,
   and that the step that matters is generating the character sheet.
2. Once they have created and saved it, call `genai_list_characters` again and continue from Step 2.

If the user just wants "a person" for a single image with no recurring identity, that is not a
character at all — hand off to `rendrr-generate`.

## A character without a sheet

An entry with no `sheet` will not hold its identity reliably. Use `image` (and `closeup` if present)
as references, tell the user the likeness will drift, and point them at the Characters studio to
generate the sheet once — it pays for itself from the second generation onward.

## Credits

Generations are charged to the signed-in user's own rendrr credits; the response reports the real
charge in `credits`. Mention cost only when asked, when a run is unusually expensive, or when a call
fails for insufficient credits. Failed generations are not charged.

## References

- `references/consistency-guide.md` — keeping identity stable across images, video, outfits and products
