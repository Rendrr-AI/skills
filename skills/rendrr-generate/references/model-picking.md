# Model picking

The catalog is live: `gateway_models` is the only place a runnable id comes from, and this file
never overrides it. What it gives you is the **heuristic** — which family to reach for, and why —
so you are not choosing by whichever row happened to come back first.

Read this as: pick the family here, then take the matching id out of `gateway_models`. If the
family is absent from that account's list, fall to the next line down.

## Discovery guardrail

Three habits that stop the common failures:

1. **List before you choose.** Call `gateway_models` unfiltered at least once per session. The
   `category` filter is a convenience, and filtering too early hides the model that actually fits.
2. **Trust the user over the catalog search.** If they say a model exists and a filtered call
   returns nothing, re-read the unfiltered list before telling them it does not.
3. **`list_models` is research, not a menu.** It searches ~1250 third-party entries so you can
   answer "does rendrr know model Z". Those ids **cannot be passed to `generate`**. Only
   `gateway_models` ids run.

## Images

| The brief | Family | Why |
|---|---|---|
| **Default, anything general** | Nano Banana Pro (`gemini/nano-banana-pro`) | the house default; strongest all-round photoreal and reference handling |
| Text in the image, a poster, UI, a layout | GPT Image 2 (`openai/gpt-image-2`) | the only family that renders typography reliably |
| Character or stylised/cartoon work | Nano Banana 2 | reference-driven, holds a look across runs |
| Fast, cheap iteration on composition | Z Image Turbo, FLUX schnell | seconds per run; use to find the framing, then rerun on the default |
| Logo, icon, vector-like, flat controlled palette | Recraft v4.1 | vector-native output, clean edges |
| Editing a photo, swapping a background, restyling | any row with **`edit: true`** | that flag is the contract; a text-to-image model ignores your source |
| A refusal on a body-focused prompt | Seedream (`bytedance/seedream/v5/*`) | cheaper and more permissive than the Google filter |
| Photoreal at high resolution | Imagen 4 | when the brief is a plate rather than a composition |

The `edit: true` flag is the single most load-bearing field in the catalog. **Multimodal = it takes
your source image along.** Passing `image_url` to a model without the flag silently produces a fresh
picture that ignores the source — the most common "it did not use my photo" bug.

## Video

| The brief | Family | Why |
|---|---|---|
| **Default serious video, references, identity** | Seedance 2.0 (`ub/seedance-2.0`) | reference-to-video with up to 4 refs and native audio |
| Draft or a throwaway variant | Seedance 2.0 Fast / Mini | same lane, a fraction of the cost |
| Longer clip, up to 15s | Seedance 2.5 | same lane, longer duration |
| A pixel-exact face from an approved still | Kling 3.0 image-to-video | no person filter — the still's face survives intact |
| Cheapest clean shot, no cuts | Kling 3.0 standard, Hailuo | single-plane motion, no reference lane |
| Highest fidelity, cinematic | Kling 3.0 Pro, Veo 3.1 | when the shot is the deliverable |
| A recorded or TTS voice driving a portrait | OmniHuman, Kling AI Avatar | image + audio in; no person filter |
| Re-voicing an existing clip | sync-lipsync | video + audio in |
| Restyling or editing an existing clip | Kling O1 Edit, Wan 2.7 Edit, Gemini Omni Flash Edit | takes a video as the source; for a preserve-the-take edit use `rendrr-ad-multiplier` |
| Reframing to another aspect ratio | Luma Photon reframe | keeps the subject, rebuilds the edges |

### The one distinction that matters on Seedance

`image_urls` and `image_url` are **different lanes**, not two ways of saying the same thing:

- `image_urls` only → reference-to-video. The images are identity, wardrobe and setting anchors.
- `image_url` only → image-to-video. That frame *is* frame 1.
- Both → the start frame is appended as the last reference and the model is told to open on it.

Pick a lane deliberately. Passing both out of habit costs a reference slot and usually is not what
the brief asked for.

## Audio

| The brief | Family |
|---|---|
| Speech / voice-over | the TTS rows (`ub/tts-openai`, `ub/tts-minimax`, `ub/tts-deepgram`) |
| Sound effect, ambience, foley | Seed Audio (`bytedance/seed-audio-1.0`) |
| Music | `ub/music-minimax` |
| Transcription | Whisper (`groq/whisper-v3`) |

For audio the prompt **is** the content: the spoken text for TTS, the description for SFX and music.

## 3D and utilities

| The brief | Family |
|---|---|
| A mesh/GLB from reference images | Hunyuan3D v2 (multi-view for several angles), Trellis |
| Upscale a still | Clarity upscaler |
| Upscale a clip, incl. 4K | Topaz video upscale, ByteDance video upscaler |
| Cut out a subject | Bria background remove |

Finishing a UGC or product clip on a video upscaler is worth it — it is the cheap step that makes
the output look platform-ready rather than model-generated.

## When two fit

Prefer the model whose title and description match the **demanding** part of the brief — typography,
photorealism, motion, identity — over the one that appears first in the list. When the brief has no
demanding part, take the default for that modality.

Do not downgrade to a cheaper family to save the user money unless they asked. Do the opposite once:
when a run will be unusually expensive (long video, 4K), say so before starting it.
