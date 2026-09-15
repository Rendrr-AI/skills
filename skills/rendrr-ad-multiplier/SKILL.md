---
version: 1.0.0
name: rendrr-ad-multiplier
description: >-
  Turn one existing ad clip into several independently edited versions with
  rendrr.ai — same performance, camera, cuts and timing, with one named thing
  changed per version (the person, the product, the outfit, the background, or
  one added effect). Use when: "multiply my ad", "make variations of this
  video", "new creatives from my existing ad", "swap the product in this clip",
  "same video but a different person", "restyle this footage", "give me 5
  versions to test", "maak varianten van deze advertentie", "andere creatives
  van mijn bestaande ad", "vervang het product in deze video". NOT for: making
  a video from scratch (use rendrr-ugc-ads or rendrr-generate), re-voicing a
  clip (lipsync in the app), or stills (rendrr-product-shots).
---

# rendrr Ad Multiplier

One source clip in, N edited versions out. The performance was already paid for — in attention, in
filming, in whatever made that ad work. **The job is to keep it and change one named thing.**

Everything below serves one rule: **an edit is defined by what it preserves.** A prompt that only
describes the change gives you back a new video that vaguely resembles the old one.

## Step 0 — Connect

Check whether the rendrr MCP tools are present in this session — `generate`, `gateway_models` and
`library` are the ones that must be there. If they are, continue. If not, stop and give the user
the connect step:

- **claude.ai / Claude Desktop** — Settings → Connectors → *Add custom connector*, URL
  `https://mcp.rendrr.ai/mcp`. Sign-in is Google; there is no API key to paste.
- **Claude Code** — `claude mcp add --transport http rendrr https://mcp.rendrr.ai/mcp`

MCP access is included **from the Expert plan** (Expert or custom).

## UX rules

Same as `rendrr-generate`: be brief, deliver the URLs plus one line, never dump JSON or the
assembled prompt into chat, reply in the user's language, ask at most one question.

Three more that are specific to multiplying:

- **Never run N variants before one is approved.** Run variant 1, show it, then run the rest. A
  wrong preserve-list multiplied by eight is eight paid mistakes.
- **One axis per variant.** Two changes at once produce variants you cannot compare, which defeats
  the entire purpose of making variants.
- **Say what stayed.** The user needs to hear "same take, same camera, same timing — only the
  bottle changed", because that is the claim they are buying.

## What the source has to be

| | |
|---|---|
| Length | 4–30 seconds. Do not trim, loop or freeze a clip to fit — say it is out of range |
| Form | one continuous ad or scene; a montage of unrelated cuts edits badly |
| Hosting | a public https URL. There is no upload tool on the MCP surface — ask for a hosted URL, or have the user save the clip in their rendrr library first and use that URL |
| Audio | keep the source's own audio (see "Sound", below) |

## The operations

Pick exactly one per variant.

| Operation | What it does | Needs a reference |
|---|---|---|
| `replace-person` | every appearance of one person becomes someone else | an image of the new person |
| `replace-product` | the held/shown product becomes another product | a packshot of the new product |
| `change-outfit` | the same person, different garments | an outfit image, or a description |
| `change-background` | same subject and staging, different location or wall | optional scene image |
| `change-attribute` | one named property changes (colour, material, label) | no |
| `add-element` | one thing enters the frame that was not there | optional image |
| `remove-element` | one thing leaves, and the background behind it is described | no |
| `add-effect` | one timed physical event (a splash, steam, a light change) | no |

**A person replacement is global.** The original must not survive anywhere — not through cuts,
entrances, exits, occlusions, motion blur, reflections or shadows. Say that in the prompt; it is
the single instruction that most often gets skipped and it is why an old face reappears at second 6.

**A person reference is the whole look** — face, hair, skin tone, build, grooming, clothing,
footwear, accessories. The replaced person's own clothes do not survive. Override only the clothing
half when a separate outfit image is attached or the user asks for it explicitly.

## The one rule underneath everything

**An edit prompt is a list of replacements plus a list of preservations. It is not a description
of a scene.**

> "Replace the pistol with an orange foam dart blaster, matching its original position and
> trajectory" is an instruction.
> "A man runs through a room full of confetti" is a new film.

Describe a scene and the model rebuilds it from scratch: new framing, new cuts, people moved
around. List replacements and it leaves the film alone. Every other rule below is a consequence of
this one.

## The prompt shape

Six blocks, in this order. Blocks 3 and 5 are the ones people leave out, and they are the ones
that make it an edit rather than a regeneration.

1. **The edit instruction** — open by telling it to *edit this video*, never to *reference* it.
   Reference wording makes the model treat the clip as inspiration and generate something new.
2. **Numbered replacements** — one per line, each naming its target with a unique visible anchor
   (*the amber bottle in her right hand*, never *the product*) and closing with **matching its
   original position, pose, perspective and lighting**. Give a replacement a physical description
   rather than a name: *orange foam shaft, blue fins, white rubber suction cup* survives where
   "a toy dart" does not.
3. **Preserve block** — the load-bearing half. State it positively and specifically:
   > Preserve: camera movement and camera position · cut points · framing and shot sizes · pacing ·
   > motion blur and depth of field · exposure and lighting · shadows and reflections · the original
   > motion and timing. Every person keeps their original identity, face, hair, skin tone, build,
   > position and movement, except <the one named target>. Everything else in the frame and every
   > other moment stays exactly as it is.
4. **Coverage wording**, when a replacement recurs — the model applies global rules selectively:
   *every one of them, at any second, centre frame or edge, sharp or blurred.* And when something
   must persist across cuts, say so: *once it is on, it stays on in every following shot* — the
   model does not carry objects across a cut on its own.
5. **Text preservation** — verbatim, unless the user is explicitly editing on-screen text:
   > Preserve every caption, subtitle, label, UI element and other on-screen text exactly as it
   > appears, in the same typeface, position, animation and timing.
6. **Audio and register** — strip music, subtitles and dialogue (you are putting the source audio
   back afterwards), and one line: *the result must look like a practical photographic shot, not
   animation.*

## Two traps that look like good prompting

Both of these are things a careful writer does by instinct, and both wreck an edit run.

### Timecodes: phases of one event, never a shot breakdown

**Never write a timecoded shot breakdown.** The model reads it as a storyboard and starts rebuilding
the montage — new cuts, characters in different positions. This single mistake ruins more edit runs
than anything else.

But a **timeline of the physical phases of one event inside one continuous shot** is fine, and for
a timed effect it is necessary: *the splash begins at 0.05s · rises until 0.20s · holds frozen until
1.04s · falls under gravity from 1.04s*. That describes matter, not editing.

The test: **does your timeline segment the event, or the edit?** Segmenting the event is
description. Segmenting the edit is a storyboard, and you will get one.

### Negatives: about rendering, never about content

A prohibition about **how something is drawn** is safe and useful: *no camera shake · no artificial
CGI look · no motion blur while frozen · no wobbling or drifting*.

A prohibition about **what is in the frame** does the opposite of what you want. "Do not put my
face on anyone else" summons the thing it forbids, because the model has no way to represent
absence. Write the positive preservation instead: **"everyone except the running man keeps their
original face."**

So: negatives constrain the render. Preservations constrain the content. Never swap them.

## Write it in Chinese for Seedance

Seedance is trained on Chinese-language production documentation, and Chinese edit prompts are
followed more precisely and pass moderation more smoothly than the same prompt in English. When the
run is going to Seedance, write the replacement and preserve blocks in Chinese and keep an English
copy for the user. `references/prompt-anatomy.md` carries a working bilingual original.

The shape is not invented: it is read off two production edit prompts, one shown on screen by a
creator and one published as a guide. See `references/prompt-anatomy.md` for both, annotated, with
their sources.

## Sound

**Edit silently, then put the source's own audio back.** Video-edit models will happily invent a
whoosh under every gesture and a swell under the voice, and the result no longer matches the ad the
user is testing.

- Pass `generate_audio: false` where the model exposes it.
- The finished variant should carry the **source clip's original audio track**, unchanged.
- On the rendrr MCP surface there is no muxing step, so say plainly that the returned variant is
  silent and the original audio has to go back on in the editor — or point at the app, where the
  Flows canvas can do it.
- A silent source stays silent. Never substitute music.

## Picking the model

Call `gateway_models` with `category: "video-to-video"` and choose from what comes back. What each
family is for:

| The edit | Family |
|---|---|
| **Default — swapping a person, product or scene with references** | Kling O1 Edit |
| A described change with no reference image | Wan 2.7 Edit Video |
| A conversational change, or one that needs the model to reason about the scene | Gemini Omni Flash Edit |
| A bold or stylised restyle | Grok Edit Video |
| Copying the movement of one clip onto another | Kling 3.0 Motion Control |

Note for the user when it comes up: Seedance is rendrr's reference-to-video engine, but its
**video-edit** mode is not wired on this surface yet — a video source goes to the models above.

## The workflow

1. **Read the source.** Ask for the hosted URL and its length. Out of 4–30s, stop and say so.
2. **Agree the axis list.** One line per variant, in order: *1 — new product · 2 — different
   presenter · 3 — kitchen instead of bathroom*. Confirm the list before spending anything.
3. **Approve the look on a still first** (worth it whenever the change is visual and large). Take
   one frame, run an edit-capable image model with the same change, show it, and only then run the
   video. A still is cheap and infinitely revisable; a video run is neither. This is the same
   still-first logic the UGC lane uses.
4. **Run variant 1** with the full six-block prompt. Show it. Get a yes.
5. **Run the rest, one at a time, in order.** Same preserve list, same negatives, only block 2
   differs per variant. Retry a failed variant once, then report it and continue.
6. **Deliver** in order, labelled *Variant 1 · 2 · 3*, each with the one line that says what changed
   and what stayed. Save the keepers with `library_save` so they join a tag pool; schedule with
   `post_draft`, which always lands in the approval queue.

## Reference docs

- `references/prompt-anatomy.md` — an annotated production edit prompt, with its source
- `references/variant-axes.md` — which axes are worth testing, and which pairs are worth avoiding
