---
version: 1.0.0
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

Check whether the rendrr MCP tools are present in this session. If they are, continue. If not, stop
and give the user the connect step:

- **claude.ai / Claude Desktop** — Settings → Connectors → *Add custom connector*, URL
  `https://mcp.rendrr.ai/mcp`. Sign-in is Google; there is no API key to paste.
- **Claude Code** — `claude mcp add --transport http rendrr https://mcp.rendrr.ai/mcp`

MCP access is included **from the Expert plan** (Expert or custom; Pro buys templates and
community, not this connection). The server's own refusal says the same thing and links to
`/billing`.

## UX rules

Same as `rendrr-generate`: be brief, deliver the media URL plus one line, never dump JSON or ids,
reply in the user's language, ask at most one question, and never invent a character, a model or a
parameter that a tool did not return.

## Step 1 — Read the roster

Call **`list_characters`** (no arguments). Each entry can carry:

| Field | Use |
|---|---|
| `name` | how the user refers to this character |
| `identity` | a short English identity descriptor — **the phrasing to reuse verbatim** |
| `prompt` | the fuller base description the character was built from |
| `sheet` | the character reference sheet: the strongest identity reference |
| `image` | the base portrait |
| `closeup` | macro close-up — fine facial detail |
| `bodySheet` | headless body/outfit reference |
| `featureBoard` | face-free feature board: isolated macro crops (one eye per tile, brow, lips, nose, skin patch, hair swatch, colour chips) that are deliberately NOT arranged as a face — the server sends it WITH `bodySheet` on Seedance |
| `refImage` | the source photo, for reference-based characters |
| `traits` | the structured attribute selection, when the character was built in the wizard |

Match the user's wording to a `name`. If nothing matches, say which characters do exist rather than
guessing at the nearest one.

## Step 2 — Generate with the character as reference

Reusing a character is an **edit-style generation**: pick a model from `gateway_models` whose
`edit` flag is `true` (it accepts source images), then hand it the character's own images as
references while the prompt carries the identity wording and the new scene.

```json
{ "name": "generate",
  "arguments": {
    "model": "<edit-capable id from gateway_models>",
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
5. **POV shots with a character work.** A "First-person POV … shot from the eyes of @<name>" prompt
   goes through rendrr's POV engine, which repurposes the attached reference as the IDENTITY of the
   visible body parts (skin tone, hair, build) — never as a second person in frame. In mirror-selfie
   mode the reference steers the face in the reflection. Details: the POV section in `rendrr-generate`.

## Video on the Seedance lane (person filter)

Seedance, Veo and Omni refuse a loose photoreal face in the references. rendrr handles that
server-side, so the call stays simple — but only if you feed it the right asset:

1. **Attach `sheet` only**, plus a product or outfit reference. The server swaps every face-bearing
   character image (sheet, portrait, close-up) for the character's faceless variant before the run,
   appends the character's **feature board** as the LAST reference (Seedance only, only while the
   4-reference cap allows it — your own references always win) and adds "Identity lock — <name>:
   <identity + face anchors> Feature board (reference image N): …". A labelled sheet with face
   close-ups is refused as readily as a portrait (0 of 3 on 2 Sep '26), so it never goes in as-is.
   Never attach `featureBoard` yourself; never number your references past the ones you attached.
2. **The face is rebuilt from the crops + text** — the board carries the exact eye colour and shape,
   lips, nose, skin tone/texture and hair without ever showing a face; the anchors carry the rest.
   That only works for a character whose Rendrr Soul is complete (faceless variant + feature board +
   anchors — rebuild the Soul on an older character to add the board); a character with a sheet only
   falls through to the Hailuo offer. After a refusal the server reads WHICH image ByteDance named
   (content[k]) and replaces exactly that one — board dropped, body → next headless variant, body
   dropped in favour of the board, or a blurred user ref — up to 3 retries (a refusal is synchronous,
   ~5 s); two board-caused rescues pause the board for that character until its Soul is rebuilt.
   The body sheet is a true ghost-mannequin (no face anywhere, hair from behind) since 3 Sep '26 —
   older "faceless" sheets kept the face in their hero panel and were refused; they migrate on their
   first Seedance run. Older Souls get the board via the owner-only API
   (`POST /api/characters/soul {id}`; `refreshBoard: true` forces a new one) or via the paid Rebuild
   (which also regenerates the sheet = identity drift, so not while measuring). In the app the sheet is
   visible to everyone; the faceless body sheet, feature board and variants show in admin view only.
   For a pixel-exact face use Kling 3.0 image-to-video from an approved still: no person filter,
   native audio.
3. **Keep `identity` verbatim and write nothing about the face.** Your description competes with the
   sheet and the anchors exactly as it competes with a reference. Two identities per clip at most.
4. **Refs-only is the identity lane.** A photoreal start frame in `image_url` can make Seedance hand
   off to a fallback model by itself (the reply carries `switched`), and that fallback drops the
   sheet. For a locked scene and a locked
   face, put the approved still in `image_urls` as the last reference and say "open on reference
   image N".
5. **One gesture, under 10 s.** When the character speaks: `generate_audio: true`, one quoted line
   plus the no-on-screen-text guard — the recipe is in `rendrr-generate` (Seedance lane).

Try-on with a character: Image 1 = sheet, Image 2 = the garment's front/back reference. Prompt
"wearing exactly the garments from reference image 2", each garment named with its own colour and
fabric, one slow half-turn, camera at arm's length.

Deeper guidance, including what to do when the likeness drifts: `references/consistency-guide.md`.

## Creating a character

Character creation lives in the **rendrr app**, not on this tool surface — the Characters studio
(app.rendrr.ai → Characters) runs the builder and generates the reference sheet that makes a
character reusable. The `character_sheet` tool exists on the server but is owner-only: it is absent
from the customer tool set, so there is no way to build or rebuild a sheet over this connection.

So when the user wants a *new* character:

1. Say plainly that creation happens in the Characters studio at `https://app.rendrr.ai/influencer`,
   and that the step that matters is generating the character sheet.
2. Tell them what to bring: one to three photos, face unobstructed and in focus, even light, no
   filter. `references/consistency-guide.md` has the full list under "What the sheet is built
   from" — a sheet can only be as good as its source, and a beauty filter is the most damaging
   input of all.
3. Once they have created and saved it, call `list_characters` again and continue from Step 2.

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

## Handing off

- A character **speaking** to camera with a product — talking-head, unboxing, how-to, review,
  try-on — is `rendrr-ugc-ads`. It uses the identity lane described here and adds the line, the
  gesture and the mode.
- A character **holding** a product in a still is `rendrr-product-shots` (model try-on mode).
- A character in a one-off scene with no recurring identity need is `rendrr-generate`.
