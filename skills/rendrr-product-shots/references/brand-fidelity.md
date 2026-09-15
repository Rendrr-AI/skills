# Brand fidelity

Keeping the label, the wordmark and the colour true to the product that actually exists. This is the
hard part of product work and the reason a product shot is not just an image with a bottle in it.

## Why label text degrades

An image model does not read a label and copy it. It reproduces what a label of that kind tends to
look like — the shapes, the rhythm, the density of a wordmark — and then renders something with the
same texture. That is why a failed label is rarely gibberish: it is usually a plausible, well-set,
completely wrong word in a typeface the brand does not own.

Three things make it worse, and all three are under your control:

1. **The product is small in the frame.** Fine detail gets fewer pixels and less model attention, so
   it is reconstructed rather than copied. A pack occupying an eighth of a wide banner will lose its
   text almost every time.
2. **The reference is soft, angled, or low resolution.** The model can only copy what it can resolve.
   A blurry source is an invitation to invent.
3. **The prompt re-describes the product.** Every adjective you add about the pack competes with the
   reference. Describing the label in words nudges the model towards rendering *a* label rather than
   reproducing *this* one.

## Anchoring it

**Attach the sharpest reference you have.** A clean, well-lit, straight-on packshot beats an
atmospheric photo of the same product every time. If the user has both, use the clean one as the
anchor and treat the atmospheric one as mood, not as a reference.

**Match the reference to the view.** A front-facing shot needs a front reference; a three-quarter
scene benefits from front and back together, because the model otherwise invents whatever is around
the curve — and invents it differently on each run. A saved prop with a two-panel front/back sheet
covers this in one image.

**Say it once, exactly.** State the wording in quotes a single time and instruct that it be copied
character for character from the reference, in the reference's own typeface and layout, with no
re-lettering, re-typesetting, translation or new design. Repeating the instruction three times does
not triple its weight; it just crowds out the scene.

**Do not restate what the reference shows.** Give the pack's role in one line and let the image carry
the rest. The `note` on a saved library element already holds the description the reference was built
from — reuse that wording rather than writing a fresh one that pulls in a different direction.

**Ask for higher resolution when the model offers it.** `resolution` in `input` accepts values like
`2k` on models that support it. More pixels on the label is the cheapest fidelity win available. The
server snaps an unsupported value to the nearest one it can serve and reports that in `note`.

**Frame so the label matters.** If the brief allows, bring the product closer or crop tighter. A shot
where the pack fills a third of the frame holds its text far better than the same scene shot wide.

## Colour

Brand colour drifts more quietly than text and gets noticed later. Two habits help: state the colour
in plain terms alongside the reference ("the deep bottle green of the reference, unshifted"), and
avoid strongly coloured light in the scene unless the user asked for it. Golden-hour warmth and neon
gels both pull a brand colour somewhere it does not belong, and the result is only obvious next to
the real pack.

Hex codes are not reliably honoured. Treat one as a hint to a human reviewer, not as a control.

## When the text still comes out wrong

Work in this order and stop as soon as it is right:

1. **Regenerate once with a stronger fidelity clause.** Move the instruction to the front of the
   prompt, name the exact wording again, and add that the label must be legible and unchanged. One
   retry fixes a large share of cases — each generation is an independent sample, and the first one
   simply lost the coin toss.
2. **Cut the competition.** Delete any clause describing the pack's appearance, drop from three
   references to the single sharpest one, and simplify the scene. Fewer instructions, more attention
   on the reference.
3. **Change the framing, not the model.** Bring the product closer, straighten the angle to face the
   camera, raise the resolution. Swapping models first feels productive and usually is not — the same
   under-specified reference fails everywhere.
4. **Then try another edit-capable model** from `gateway_models`, preferring one whose title or
   description mentions typography or design work.
5. **Point the user at the prop sheet flow in the rendrr app.** When a product comes back wrong
   repeatedly, the reference is the problem, not the prompt. In the rendrr studio the user can save
   the product as a prop with a front/back reference sheet — a purpose-built, evenly lit, multi-view
   plate of the pack. It is a one-time step, it becomes the definitive anchor for every later
   generation, and it is the difference between arguing with a model and giving it something to copy.

## Two things worth saying out loud

**Do not silently accept a wrong label.** The user knows their own pack better than any reviewer, but
they may not zoom in. If the text or the mark is off, name it in your one line of delivery.

**For dense copy, generate clean and typeset afterwards.** Ingredient lists, legal text, nutrition
panels and long claims are beyond what image models render reliably. Produce the shot with the pack
turned so that text is not the subject, or leave the panel out of frame, and let a design tool handle
anything that has to be read word for word. That is not a workaround; it is how the real version of
this job is done.
