# Consistency guide

How to keep one character recognisable across many generations. The failure mode is always the same:
each generation is an independent sample, so anything you do not pin down gets re-invented.

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
4. **base image** — only when there is no sheet

Two to three references is the working range. Beyond that the constraints start to conflict, and a
model resolves conflicts by averaging — which produces a face that is plausibly nobody.

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
