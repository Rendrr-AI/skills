# Consistency guide

How to keep one character recognisable across many generations. The failure mode is always the same:
each generation is an independent sample, so anything you do not pin down gets re-invented.

## What the sheet is built from

The sheet is generated from source photos, so it inherits their limits. A sheet built from one
flat, filtered selfie produces a character who is stable and slightly wrong in every later run.

**How many.** One good photo works; two or three is better. Past three the sheet starts averaging
rather than resolving, which is the same failure as stacking too many references at generation time.

**What each photo needs.**

- The face unobstructed and in focus, eyes visible, one person only.
- Even light. Hard side light bakes a shadow into the identity; a warm indoor bulb bakes in a skin
  tone that then follows the character everywhere.
- No sunglasses, no hat over the brow, no heavy beauty filter. A filter is the single most damaging
  input: it smooths exactly the pores, asymmetry and texture that make a face read as real.
- Makeup and styling the character should actually have. Whatever is in the source becomes part of
  who they are.

**What the set should vary.** If you have more than one photo, vary the angle (front and a
three-quarter) and keep everything else stable. Do not vary expression, styling and light all at
once — the model then has to guess which differences are the person and which are the day.

**What to avoid.** Group shots, costumes, extreme wide-angle selfies (they widen the nose and
narrow the temples, and the sheet keeps it), and the same pose repeated — a second identical photo
adds nothing the first did not already say.

**Physical notes beat more photos.** The character's identity text carries the traits the images
cannot state unambiguously — a specific eye colour, a mole, the exact hair length, the skin tone in
words. That text is what survives into the video lane, where the face itself cannot travel. Spend
the effort there.

## The character sheet is the anchor

A character sheet is a single composite reference showing one identity from several angles — face
front, three-quarter and profile, full body, and close detail. It exists so a model can see the
identity as a **design asset** rather than infer it from one lucky portrait.

Attach the sheet to every generation of that character. A single frontal portrait gives the model one
view to extrapolate from, and extrapolation is where the face slides.

Reference stack, in order of usefulness:

1. **sheet** — always
2. **closeup** — when the face is large in frame, or the previous run softened the features
3. **bodySheet** — when the outfit, proportions or silhouette must carry over
4. **featureBoard** — never attach it yourself: the server adds it on Seedance (see below)
5. **base image** — only when there is no sheet

Two to three references is the working range. Beyond that the constraints start to conflict, and a
model resolves conflicts by averaging — which produces a face that is plausibly nobody.

## Why video runs on the faceless variant

Video providers run a real-person filter on reference images, and an AI-generated photoreal face
trips it as readily as a photo does — a labelled multi-panel sheet included, once it carries face
close-ups (0 of 3 passed on 2 Sep '26, with and without identity text). So rendrr swaps every
face-bearing character image (sheet, portrait, close-up) for the character's faceless variant before
the run and carries the face in two face-free forms instead. (1) The **feature board** (since 2 Sep
'26): one image of eight isolated macro tiles — skin patch, nose, eyebrow, lips in the top row; one
eye, hair swatch, colour chips, the other eye in the bottom row — so the eyes sit far apart in the
bottom corners, no tile holds two features, every crop is bordered by skin or hair rather than
backdrop, and no detector can read a face in it, yet the video model can copy iris colour, eye
shape, lip shape, nose, skin tone with its real texture and hair from it. It is appended as the last
reference next to the faceless variant (Seedance only, within the 4-reference cap). (2) Text: the
identity line chosen at creation (age, skin tone, hair — authoritative) plus concrete anchors (face
shape, eye colour and shape, nose, lips, skin undertone, hair) extracted once from the portrait and
cached on the character, plus one sentence that tells the model what the board is and how to use
it. Crops and text pass the filter where a face does not, which is why the likeness holds — closely,
not pixel-exactly. A pixel-exact face in video is Kling 3.0 image-to-video from an approved still
(no person filter, native audio).

Four consequences: the portrait is the source of the anchors AND of the board, so a character
needs one; the faceless variant, the board and the anchors are built together with the sheet (one
"Rendrr Soul"), so a character with a sheet only has no fallback and an older Soul needs a rebuild
to gain the board; a face described in your own words fights the crops and the anchors instead of
helping them; and after a refusal the automatic retry replaces exactly the image ByteDance named
(content[k]: board dropped, body → next headless variant, body dropped for the board, or a blurred
user ref; up to 3 retries), so the lab ladder tells you what carried the identity in the end
(`feature-board` vs `feature-board:dropped-rung2`, `soul-retry:<steps>`) — two board-caused rescues
pause the board for that character until a rebuild. The body sheet itself is a ghost mannequin (no
face anywhere; hair from behind) since 3 Sep '26: the earlier "faceless" variant kept the face in its
hero panel and was refused twice in a row. A freshly generated board passes a vision gate (Gemini 3.6, llava
fallback) that discards any board showing a whole face or two features in one tile, and the board
only ever rides next to a face-free body reference, never alone and never next to a face.

## Keep the identity phrasing verbatim

Characters carry a short identity descriptor. Copy it into the prompt **exactly**: same words, same
order, no translation, no tightening, no synonyms. It is a key, not prose.

Rewriting it — even into something objectively better written — changes the token pattern the model
has been anchored on, and the face moves. If the description is genuinely wrong, fix it once on the
character record itself rather than editing it per generation.

Everything else in the prompt is the *new* part: setting, action, lighting, camera. Do not re-describe
eye colour, hair or face shape; the references already state those, and the second description
competes with them instead of reinforcing them.

## One change per generation

Change setting, or outfit, or age, or mood — not several at once. Two reasons:

- Each simultaneous change multiplies the chance that the model resolves the combination by drifting
  the face.
- When a result goes wrong, one change tells you exactly what caused it. Three changes tell you
  nothing, and you end up rerunning the whole thing blind.

Iterate in a chain: place the character in the scene, look, then adjust one thing. Feed a good result
back in as a reference for the next step when you want to build on it — a generation you accepted is
a stronger anchor for the next one than a description of it.

## Products, clothing and objects

Anything the character holds or wears is a second identity to keep stable, and it drifts the same way.

**Use front and back references.** A product photographed from one side gives the model no idea what
the other side looks like, so it invents one — and invents a different one each run. A front/back pair
(or a two-panel reference showing both) removes the guesswork. The same applies to clothing: front and
back, so the model does not improvise a print or a seam when the character turns.

**Say what is written on it, or say nothing.** Labels, logos and text on products are the most
fragile part of the frame. Either state the exact wording once, or describe the item without its text
and accept an unbranded prop.

**Keep the item in a separate reference from the character.** One image per subject is cleaner than a
composite where the model has to work out which part is the person and which part is the product, and
it lets you swap one without regenerating the other.

## Video

Video multiplies every consistency problem across time, because identity now has to hold for hundreds
of frames rather than one.

- **Generate a still first, then animate it.** A still you have approved is a far better start frame
  than a text description of one, and it lets you fix the likeness before spending video credits.
- **Attach the sheet as a reference in addition to the start frame** on models that accept both. The
  start frame fixes frame zero; the sheet keeps frame two hundred honest.
- **Describe motion only.** With a start frame, appearance is already fixed. Re-describing the
  character competes with the frame and is the most common cause of a face that morphs mid-clip.
- **Keep the motion calm.** Fast, large or complex movement is where faces melt and hands multiply.
  If a clip distorts, reduce the motion before you change the model.
- **Keep clips short and cut between them.** One continuous shot per generation. Long clips and
  in-prompt scene changes both degrade identity.

## Multiple characters in one frame

Hard, and worth avoiding when a composite would do. If you must:

- Attach each character's sheet, and in the prompt tie each reference to a role explicitly ("the woman
  from the first reference sheet, on the left; the man from the second, seated").
- Expect features to bleed between them. The more similar the two characters look, the worse it gets.
- The reliable route is generating them separately against a shared scene and composing afterwards.

## When the likeness drifts

Work through this in order — the first two fix most cases:

1. **Is the sheet attached?** Drift almost always traces back to a generation that ran on the base
   portrait alone, or on no reference at all.
2. **Was the identity phrasing altered?** Restore it verbatim.
3. **Does the prompt re-describe the face?** Delete those clauses and let the references speak.
4. **Too many references?** Cut back to sheet plus one.
5. **Too much happening?** Split into two generations with one change each.
6. **Is the face small in frame?** Distant subjects get less model attention. Frame tighter, or
   generate the portrait first and place it into the wider scene as a second step.
7. **Only then** try a different edit-capable model from the live list.

Video on Seedance, Veo or Omni — three more checks before changing anything else:

8. **Was a portrait attached instead of the sheet?** It was swapped to faceless; identity then
   rested on the anchors alone. Attach the sheet.
9. **Was a privacy fallback accepted?** The fallback model strips references — the face came from
   the start frame only. Regenerate the still with the sheet first, then animate.
10. **More than two characters in the references?** Only two receive an identity block.
