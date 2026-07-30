---
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

Check whether the `genai_*` tools are present in this session. If they are, continue. If not, stop
and give the user the one line they need:

- **claude.ai / Claude Desktop** — Settings → Connectors → *Add custom connector*, URL
  `https://mcp.rendrr.ai/mcp`. Sign-in is Google; there is no API key to paste.
- **Claude Code** — `claude mcp add --transport http rendrr https://mcp.rendrr.ai/mcp`

MCP access requires a **Pro plan or higher** on rendrr.ai. If tools appear but every call is
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

Start every generation task by calling **`genai_gateway_models`**. It returns exactly the models this
account can run: `id` (the value to pass as `model`), `title`, `provider`, `category` (typically
`text-to-image`, `image-to-image`, `text-to-video`, `text-to-speech`, `text-to-audio`,
`speech-to-text`) and `edit` — **`edit: true` means multimodal: it accepts a source image and can
edit it**. Filter server-side with the optional `category` argument when you know the task type.

Two more discovery tools, both parameterless:

- `genai_list_presets` — the user's quick-pick presets (name, models, prompt, params).
- `genai_list_templates` — curated Preset cards from the rendrr studio (one model + prompt + params).

If the user says "use my X preset" or "the Y template", read these first and reuse the stored prompt
and params rather than writing your own.

`genai_list_models` searches a much larger third-party catalog (~1250 entries) for research —
"does rendrr know model Z?". **Those ids are not runnable through `genai_free`.** Only ids from
`genai_gateway_models` are.

## Workflow

1. **Classify the task**, then pick from the live list: new image from text → a `text-to-image` model;
   change / restyle an existing image → a model with `edit: true`; video from text or an animated
   still → a video category; voice-over, sound effect, music → a speech/audio category. If several
   fit, prefer the one whose title and description match the brief's demands (typography, photoreal,
   motion) over the one that merely appears first.
2. **Sharpen the prompt (optional).** For a thin one-liner, call `genai_enhance` first with `prompt`
   (required), `kind` (`image` | `video` | `audio` | `director` | `character` | `scene` | `revise`),
   `instruction` (required for `revise`, which applies only that instruction to an existing prompt)
   and `refs` (how many reference images will be attached, as a number). `director` returns a long
   structured video-direction prompt; `scene` returns an environment plate with no people. It returns
   `{ ok, prompt }`. Skip it when the user already wrote a detailed prompt — silently rewriting their
   words is a bug, not a feature.
3. **Generate with `genai_free`.** Shape below.
4. **Deliver.** Media URL + one line: what it is, and the model in plain words. If the response
   carries a `note`, surface it — that is where the server reports settings it had to adjust.

The user's saved generations are browsable with `genai_library` (no arguments) when they ask "what
did I make earlier" or want to reuse an asset — its items carry `url`, `kind`, `model` and `prompt`.

## Calling `genai_free`

Arguments: `model` (**required**), `prompt`, `input` (object). `prompt` is merged into `input`, so
either place works; keep `prompt` at the top level for readability. The schema also exposes an
`account` argument — leave it out, it is ignored for user accounts.

**Text to image**

```json
{ "model": "<id from genai_gateway_models>",
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

- `references/prompt-guide.md` — writing prompts for image and video that survive contact with a model
- `references/troubleshooting.md` — what each refusal means and how to recover
