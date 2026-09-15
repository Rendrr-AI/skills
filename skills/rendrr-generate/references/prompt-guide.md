# Prompt guide

General craft for image and video prompts. Nothing here is model-specific; read the live model list
for what a given model actually accepts.

## The structure that works

Write one flowing paragraph that covers, in this order:

1. **Subject** — who or what, with the two or three attributes that matter. "A ceramicist in her
   fifties, flour-dusted apron, hands wet with slip" beats "a woman working".
2. **Action / pose** — what is happening in this exact frame. Present tense, one action.
3. **Setting** — where, and one concrete detail that fixes it in place ("a narrow workshop, shelves
   of unfired bowls behind her").
4. **Lighting** — direction and quality: hard afternoon sun through a side window, overcast
   diffusion, single warm practical lamp, rim light from behind.
5. **Camera** — how it was shot: focal length feel (wide 28mm, portrait 85mm), height and angle
   (eye level, low, overhead), depth of field.
6. **Style / medium** — photograph, oil painting, 3D render, editorial, cel animation. One style, not
   three.

Skip a slot when the user's brief clearly does not care about it. Never pad a prompt to look thorough.

## Length

Aim for 60–150 words. Long prompts do not raise fidelity — past a certain length models start
dropping or blending clauses, and contradictions become likelier. If a prompt is getting long,
delete adjectives before you delete structure.

## Say what you want, not what you don't

Most models have no negative-prompt field, and naming a thing tends to summon it. Rewrite negations
as positive descriptions:

- "no blur" → "tack sharp throughout"
- "not cartoonish" → "photographic, natural skin texture"
- "no people" → "empty street at dawn"
- "no text" → phrase style as camera and light direction, and simply never mention words, signs,
  captions or logos

## Editing an image

When you pass a source image, the prompt describes **the change only**. Re-describing what is already
visible fights the reference and blurs the identity of the subject.

- Weak: "a man with brown hair in a blue jacket standing in a kitchen, now at night"
- Strong: "relight the scene as night — warm lamp from the left, deep shadows, everything else unchanged"

Make one substantive change per generation. Two changes in one prompt is how you end up unable to tell
which instruction caused the regression. Chain: generate, look, refine.

Explicitly protecting what must not move helps: "keep the pose, framing and background exactly as they
are; change only the jacket colour."

## Reference images

- Order matters less than **labelling**: say in the prompt what each reference is for ("the outfit in
  the second reference", "the room in the reference photo").
- Two to three references is the practical sweet spot. More references means more constraints in
  conflict, and the model resolves conflicts by averaging — which is how faces go generic.
- A reference supplies appearance. It does not supply pose, camera or lighting; those still come from
  your prompt.

## A product in hand

A held object stays held when the hand is given something physical to do. Name four things:

- **contact** — "fingers wrapped around the neck of the bottle, thumb resting on the label edge"
- **weight** — "the wrist angled under its weight", "resting in the open palm"
- **occlusion** — "the lower third of the label hidden behind the fingers" (fewer visible fingers,
  fewer errors)
- **orientation** — "label facing the lens", "tilted so the front panel catches the window light"

One grip, held still or moved once. Floating, hovering and levitating are rendered on request; when
the product must sit in a hand, none of those words appear. Count the fingers before delivering.

## Video

**Text to video.** Describe one continuous shot. Name the camera move (slow push-in, dolly left,
static locked-off, handheld drift) and one subject motion, then let the rest be still. Cutting between
shots inside a single prompt produces mush; generate separate clips and edit them together.

**Image to video.** With a start frame, describe **motion only**. Appearance, wardrobe and background
are already fixed by the frame; repeating them competes with it. Cover: camera movement, the subject's
one gesture, and ambient motion (hair, steam, fabric, dappled light).

Keep motion physically plausible. Calm, well-specified movement survives; frantic movement invites
morphing, extra limbs and melted faces. If a result distorts, the first fix is less motion, not a
different model.

**Dialogue.** One line per clip, 8–14 words, in quotes, spoken to the lens, with a delivery note
(pace, the stressed word, the expression on the last word). Then close with the guard, verbatim:
"The spoken words are audio and lip movement only — no on-screen text, subtitles, captions or words
anywhere in the video." The studio appends that sentence itself; over MCP you append it. This is the
one negation that stays — without it video models burn the quote in as a subtitle. Two speakers =
two clips, or the director shape (`enhance` with `kind: "director"`). On Seedance the voice is
native: pass `generate_audio: true` and the model speaks the line.

## Aspect ratio

Decide from the destination, not from habit:

- `9:16` vertical — Reels, TikTok, Stories, Shorts
- `1:1` square — feed posts, avatars, thumbnails in a grid
- `16:9` landscape — YouTube, presentations, hero banners, site headers
- `4:3` / `3:4` — print-ish, product cards, editorial portraits

Generate at the ratio you need. Cropping a 16:9 render into 9:16 throws away the composition the
model built, and the subject is usually the part you lose.

## Phone-UGC realism

The candid look is camera behaviour, not a device name: "one continuous handheld take at arm's
length", "drifts a few degrees and corrects", "reacts to the subject slightly late", "natural colour,
fine grain, no grade". A named phone or camera is rendered in frame. If a brief demands one, pair it
with the single-frame guard: `enhance` with `recipe: "ugc-ad"` appends it.

## Known weak spots

**Text in images.** Rendering legible words is the single most failure-prone thing you can ask for.
If text is essential, keep it to a few short words, state them in quotes exactly once, choose a model
whose description mentions typography or design, and expect to regenerate. For anything longer than a
headline, generate the image clean and add the type in a design tool.

**Hands and fingers.** Improved but still fragile, especially when hands manipulate small objects.
Reduce risk by keeping hands relaxed, partially occluded, or out of frame — and by not stacking
"holding X while doing Y" into one prompt.

**Crowds and repetition.** Faces in the background, rows of identical objects and reflections are
where artefacts hide. Prefer shallow depth of field so the background is soft by design.

**Symmetry and counting.** Models do not count. "Exactly five bottles" is a request, not a
constraint — verify visually, or compose so the exact number does not matter.

## Iterating

When a result misses, change one variable and rerun. In rough order of leverage:

1. the subject/action clause (the most common real cause of a wrong image)
2. lighting
3. camera and framing
4. style
5. the model

Swapping the model first feels productive and usually is not — the same vague prompt is vague
everywhere.
