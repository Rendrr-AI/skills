---
version: 1.0.0
name: rendrr-generate
description: >-
  Generate and edit images, video and audio with rendrr.ai, choosing the model
  live from the account's own catalog. Use when: "generate an image", "make a
  picture of ...", "create a video", "animate this photo", "image to video",
  "edit this image", "change the background", "restyle this photo", "make an ad
  visual", "product shot", "social post image", "thumbnail", "make a voice-over",
  "sound effect", "background music", "text to speech", "improve this prompt",
  "which models can I use", "show my rendrr library". NOT for: keeping one
  character's face and identity recognisable across generations, character
  sheets, or AI-influencer work — use rendrr-characters for that.
---

# rendrr Generate

Produce media through rendrr's MCP tools. One rule governs everything below: **the catalog is read
at runtime, never assumed.**

## Step 0 — Connect

Check whether the rendrr MCP tools are present in this session. If they are, continue. If not, stop
and give the user the one line they need:

- **claude.ai / Claude Desktop** — Settings → Connectors → *Add custom connector*, URL
  `https://mcp.rendrr.ai/mcp`. Sign-in is Google; there is no API key to paste.
- **Claude Code** — `claude mcp add --transport http rendrr https://mcp.rendrr.ai/mcp`

MCP access is included **from the Expert plan** (Expert or custom; Pro buys templates and
community, not this connection). The server's own refusal says the same thing and links to
`/billing`. If tools appear but every call is
refused, see `references/troubleshooting.md`.

## UX rules

1. Be brief. The deliverable is the media URL plus one line of context — nothing else is interesting.
2. Never paste raw JSON, tool payloads, model slugs or internal ids into chat.
3. Reply in the language the user wrote in. Parameter names stay English.
4. Ask at most one clarifying question, and only when you genuinely cannot proceed. A missing aspect
   ratio is not a blocker; a missing subject is.
5. Do not narrate the plumbing ("listing models", "calling the tool"). Just produce the thing.
6. Do not downgrade to a cheaper model to save the user money unless they asked. Pick for quality.
7. Never invent a model id, a parameter, or a price. If it did not come back from a tool, it does not
   exist.

## Live discovery — do this first

Start every generation task by calling **`gateway_models`**. It returns exactly the models this
account can run: `id` (the value to pass as `model`), `title`, `provider`, `category` (typically
`text-to-image`, `image-to-image`, `text-to-video`, `text-to-speech`, `text-to-audio`,
`speech-to-text`) and `edit` — **`edit: true` means multimodal: it accepts a source image and can
edit it**. Filter server-side with the optional `category` argument when you know the task type.

Two more discovery tools, both parameterless:

- `presets` — the user's quick-pick presets (name, models, prompt, params).
- `templates` — curated Preset cards from the rendrr studio (one model + prompt + params).

If the user says "use my X preset" or "the Y template", read these first and reuse the stored prompt
and params rather than writing your own.

`list_models` searches a much larger third-party catalog (~1250 entries) for research —
"does rendrr know model Z?". **Those ids are not runnable through `generate`.** Only ids from
`gateway_models` are.

Three habits that prevent the usual failures: call `gateway_models` **unfiltered** at least once
per session (filtering early hides the model that fits); when the user insists a model exists and a
filtered call returns nothing, re-read the unfiltered list before contradicting them; and treat the
`edit` flag as a contract — passing `image_url` to a model without it silently produces a fresh
picture that ignores the source. That is the single most common "it did not use my photo" bug.

Which family to reach for, per modality and per brief: `references/model-picking.md`.

## Workflow

1. **Classify the task**, then pick from the live list: new image from text → a `text-to-image` model;
   change / restyle an existing image → a model with `edit: true`; video from text or an animated
   still → a video category; voice-over, sound effect, music → a speech/audio category. If several
   fit, prefer the one whose title and description match the brief's demands (typography, photoreal,
   motion) over the one that merely appears first. The per-brief heuristic — which family, and why —
   is `references/model-picking.md`.
2. **Sharpen the prompt (optional).** For a thin one-liner, call `enhance` first with `prompt`
   (required), `kind` (`image` | `video` | `audio` | `director` | `character` | `scene` | `revise`),
   `instruction` (required for `revise`, which applies only that instruction to an existing prompt)
   and `refs` (how many reference images will be attached, as a number). `director` returns a long
   structured video-direction prompt; `scene` returns an environment plate with no people. It returns
   `{ ok, prompt }`. Skip it when the user already wrote a detailed prompt — silently rewriting their
   words is a bug, not a feature.
3. **Generate with `generate`.** Shape below.
4. **Deliver.** Media URL + one line: what it is, and the model in plain words. If the response
   carries a `note`, surface it — that is where the server reports settings it had to adjust.

The user's saved generations are browsable with `library` (no arguments) when they ask "what
did I make earlier" or want to reuse an asset — its items carry `url`, `kind`, `model` and `prompt`.

A generation can be promoted to a **named library element** with `library_save` (url + name +
tags + desc) so flows, @-mentions and tag-pools can reuse it; `library_update` edits an
existing item's name/tags/desc. Flows themselves are readable and buildable over the same
connection: `flows` (list), `flow_get` (full graph) and `flow_save` — flow_save
runs the web editor's own validation, which silently drops unknown node fields, so read a similar
flow first and mirror its node shapes. Scheduling stays `post_draft` (always lands in the
approval queue — it can never publish by itself).

## POV / first-person shots

rendrr has a dedicated server-side POV engine (since 20 aug '26 model-aware). Any prompt containing
"POV", "first-person" or "from the eyes of …" (EN/NL) is automatically restructured into a strict
first-person template, with a free vision check + up to 2 retries on images. Use it deliberately:

- Best form: `First-person POV image, shot from the eyes of <who>. <what they see & what happens>.
  Wearing <clothing>.` — exactly the shape the studio's "First-person POV" preset builds.
- Describing clothing, or a lying/sitting posture, routes to the looking-down-along-own-body framing
  (the only way to see your own body without a mirror). An explicit forward cue ("watching the TV",
  "looking out the window") keeps the eye-level view; "mirror selfie" is its own mode.
- Model dialects are automatic: Nano Banana (Pro)/GPT-Image get the full instruction template +
  avoid-list; Seedream/Seedance and the free Workers-AI models get a compact photographic form —
  POV works on Seedream too.
- An @character reference becomes the IDENTITY of the visible body parts, never a second person.
- The response carries `pov` metadata (mode/posture/dialect/retries/doubt); it is stored on the
  library item — useful when judging why a POV result looks the way it does.
- Clothing fidelity: name each garment separately with its colour/fabric ("black lingerie top with
  flowers and black bottom") — a merged "set" invites the model to improvise; the enhancer is
  instructed to keep garments verbatim.

## Seedance lane — roles, native audio, dialogue

Seedance rows (ids starting `ub/seedance-`) differ from other video models in three ways:

1. **Roles are exclusive.** `image_urls` only = reference-to-video (identity lane, up to 4 refs).
   `image_url` only = image-to-video (that frame is frame 1). Both together = the start frame is
   appended as the LAST reference and the server tells the model to open on it. Choose a lane; do
   not pass both by habit.
2. **Native audio.** Pass `generate_audio: true`. Speech is written INTO the prompt as one quoted
   line — the model produces the voice and the lip movement itself. There is no audio-file input on
   this surface; a recorded voice driving a portrait is the app's Avatar node (table below).
3. **Person filter.** Photoreal faces in the references are refused — a labelled sheet with face
   close-ups too (0 of 3 passed on 2 Sep '26). Attach a character's `sheet` anyway: the server swaps
   every face-bearing character image (sheet, portrait, close-up) for the character's faceless
   variant before the run, appends the character's face-free **feature board** (isolated eye/brow/
   lip/nose/skin/hair crops, never a face) as the last reference while the 4-ref cap allows, and adds
   the identity text (creation traits + face anchors + what the board is), so the run passes and the
   face is rebuilt from crops + text — close, not pixel-exact. Never attach the board yourself; a
   refused run retries up to 3 times, each time replacing exactly the image ByteDance named (board
   dropped, body → next headless variant, body dropped for the board, or a blurred user ref), and two
   board-caused rescues pause the board for that character until its Soul is rebuilt. For a pixel-exact face use
   Kling 3.0 image-to-video from an approved still (no person filter, native audio). A photoreal
   START frame on Seedance answers `needsConfirm: "privacy_fallback"` (see
   `references/troubleshooting.md`).

Settings that hold: `aspect_ratio: "9:16"`, `resolution: "720p"` (drafts) or `"1080p"`, `duration`
4/5/6/8/10 (up to 15 on Seedance 2.5). One continuous take, at or under 10 s.

### UGC talking-head / try-on recipe (Seedance, native audio)

For a full UGC ad — choosing between talking-head, unboxing, how-to, review, try-on, showcase and
problem-solution, and writing the line — use **`rendrr-ugc-ads`**. The shape below is the MCP call
that skill ends up making, kept here because it is also the generic reference-to-video shape.

```json
{ "model": "<ub/seedance-* id from gateway_models>",
  "prompt": "<six-part shape below>",
  "input": { "image_urls": ["<character.sheet>", "<product prop or outfit reference>"],
             "aspect_ratio": "9:16", "resolution": "1080p", "duration": 8,
             "generate_audio": true } }
```

Prompt shape, in this order, 90–150 words:

1. **Role lines** — `Image 1 (<name>) -> identity lock: <identity phrasing verbatim>. Image 2
   (<product>) -> product: the exact pack, label artwork and proportions, held in hand throughout.`
   Try-on: `Image 2 (<outfit>) -> wardrobe: exactly these garments, worn.`
2. **Frame** — `Vertical phone video, one continuous handheld take at arm's length, wide 28mm feel,
   soft window light from the left, natural colour, fine grain.` Camera behaviour, never a device name.
3. **Staging and grip** — where they sit or stand, and the product physically held: `holds the bottle
   at chest height, fingers wrapped around the neck, thumb on the label edge, label toward the lens`.
4. **Dialogue** — one line, 8–14 words, spoken to the lens, with a delivery note: `looks straight
   into the lens and says, unhurried, stressing "<word>": "<line>"`.
5. **One motion + material + sound** — `on "<word>" she lifts it a few centimetres so the label
   catches the light, then settles. The camera drifts a couple of degrees and corrects, reacting
   slightly late.` Keep the motion MINIMAL — one small gesture, then settle; large movement is the single biggest realism tell (this is the pipeline the top AI-UGC creators state outright: still → minimal-motion i2v → upscale). Say how the product behaves as it moves (`soft ribbed stretch fabric: it flexes
   and the straps sway` / `the bottle stays rigid`) or it hangs stiff like a cutout, and direct the
   sound (`only her voice over quiet room tone; the garment moves silently`) or the model adds a
   whoosh to every gesture. Write the line as it is said — hyphenate compounds ("try-on haul") and add
   a delivery note (bright, casual, natural pace); a bare three-word line is read oddly.
6. **Fidelity + guard, verbatim** — `Copy the label artwork and wordmark exactly as in reference
   image 2. The spoken words are audio and lip movement only — no on-screen text, subtitles,
   captions or words anywhere in the video.`

Deeper: `recipes` with `kind: "video"` (entries `ugc-talking-head`, `cinematic-video`).

### Which talking-head lane

| The user wants | Lane | Where |
|---|---|---|
| A character says a short line, product in hand, native sound | Seedance, `generate_audio: true`, dialogue in the prompt | `generate` — recipe above |
| A recorded or TTS voice driving a portrait | Avatar node (OmniHuman / Kling Avatar: image + audio, no person filter) | rendrr app → Flows → "Talking (UGC)" |
| Re-voice an existing clip | Lipsync node (video + audio) | rendrr app → Flows → "Talking (UGC)" |

Over this surface only the first row runs through `generate`. Point the user at the app for the
other two.

## Safety refusals

Google's filter (PROHIBITED_CONTENT) and the Workers-AI input filter ("8007 NSFW") refuse
body-focused/lingerie content. The studio shows an automatic switch-to-Seedream bar; over MCP,
retry the same input on `modelark/seedream-4-0` (cheap and more permissive). Never retry the same
prompt on the same model — same refusal, billed twice.

## Calling `generate`

Arguments: `model` (**required**), `prompt`, `input` (object). `prompt` is merged into `input`, so
either place works; keep `prompt` at the top level for readability. The schema also exposes an
`account` argument — leave it out, it is ignored for user accounts.

**Text to image**

```json
{ "model": "<id from gateway_models>",
  "prompt": "<the full prompt>",
  "input": { "image_size": "landscape_16_9", "num_images": 1 } }
```

**Edit an image** (model must have `edit: true`)

```json
{ "model": "<edit-capable id>",
  "prompt": "what should change — not a re-description of the photo",
  "input": { "image_url": "https://…/source.jpg" } }
```

**Video** — `image_url` is the start frame; `image_urls` is a list of reference images (identity,
outfit, scene) on models that support references.

```json
{ "model": "<video id>",
  "prompt": "<motion description>",
  "input": { "image_url": "https://…/frame.jpg", "duration": 5,
             "resolution": "1080p", "aspect_ratio": "9:16" } }
```

**Audio** — the prompt is the spoken text (TTS) or the sound description (SFX/music); `input` can stay
empty.

Common `input` keys — pass only what matters, the server fills sensible defaults:

| Key | Applies to | Typical values |
|---|---|---|
| `image_url` | edits, image-to-video | one https URL — source image or start frame |
| `image_urls` | multi-reference edits and video | array of https URLs |
| `image_size` | images | `square`, `square_hd`, `portrait_4_3`, `portrait_16_9`, `landscape_4_3`, `landscape_16_9` |
| `num_images` | images | 1–4 |
| `resolution` | images / video | `1k`,`2k`,`4k` / `480p`,`720p`,`1080p`,`4k` |
| `aspect_ratio` | video | `16:9`, `9:16`, `1:1`, … |
| `duration` | video | seconds |
| `generate_audio` | video models that support it | `true` / `false` |
| `quality`, `output_format` | some image models | model-specific |

Unsupported or out-of-range settings are **snapped to the nearest supported value or dropped**, and
the response says so in `note`. Two exceptions return an error instead of silently adjusting:
`duration` on per-second-billed models and `generate_audio` where audio is a price tier — leave those
keys out rather than guessing.

Every URL you pass must be publicly fetchable over https. There is no upload tool on this surface, so
a local file on the user's machine cannot be sent — ask them for a hosted URL, or generate the
reference first and reuse the URL that comes back.

A product with no photo is not a product shot (hand off to `rendrr-product-shots` only when a source
exists). If the user insists on text only, describe four things — category, packaging form, colour,
one distinctive feature — and say the pack will carry no wordmark.

**Response**: `media` (array of `{ url, kind }`), `texts` (for transcription-style models), `model`,
`credits` and `note`. Deliver `media[].url`. When cost comes up, quote `credits` — that is the unit
the user is billed in.

## Credits

Generations are charged to the signed-in user's own rendrr credits, and the response reports the real
charge in `credits`. Do not open with pricing and do not annotate every result with its cost. Mention
it when the user asks, when a run is unusually expensive (long or high-resolution video), or when a
call fails for insufficient credits. Failed generations are not charged.

## References

Load on demand:

- `references/model-picking.md` — which model family fits which brief, and the discovery guardrail
- `references/prompt-guide.md` — writing prompts for image and video that survive contact with a model
- `references/troubleshooting.md` — what each refusal means and how to recover
