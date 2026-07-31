# Shot modes

Deeper guidance per mode. Every mode assumes the same three-block prompt from `SKILL.md`: reference
roles, then the scene, then the fidelity clause. What changes between modes is the scene block.

A shared vocabulary runs through all of them — pick one value from each list rather than stacking
adjectives:

- **Surface** — brushed concrete, pale oak, honed marble, linen, wet slate, raw plaster, glass.
- **Backdrop** — seamless paper, a colour-matched sweep, a soft-focus room, open sky, a gradient wall.
- **Light** — even diffused studio light; a single large softbox from the left; hard midday sun with
  crisp shadows; low golden side light; overcast window light; a rim light separating pack from
  background.
- **Camera** — straight-on at label height, a slight three-quarter turn, a low hero angle looking
  slightly up, directly overhead.
- **Depth** — everything tack sharp (catalog), or a shallow plane with the label sharp and the
  background falling away (editorial).

---

## Studio packshot

The product alone, rendered so a buyer can judge it. No hands, no scene, nothing competing.

Specify a plain neutral sweep, even diffused light with no colour cast, the pack centred and upright,
and every material reading true — glass transparent, metal specular, matte board matte. Ask for the
whole product in frame with breathing room at the edges so the shot survives being cropped later.

Contact shadow is the detail that decides whether it looks placed or pasted: name it explicitly as a
soft grounded shadow directly beneath the pack.

Sizes: `square_hd` for a marketplace or feed, `portrait_4_3` for a tall bottle or box.

## In-context scene

The product where it gets used. This is the mode most people mean by "lifestyle".

Name a specific place, not a category — "a narrow kitchen counter beside a chopping board and two
limes" rather than "a kitchen". One or two supporting props, chosen to imply the moment rather than
to decorate. Say what the light is doing: morning sun through a window at a low angle, a warm evening
lamp just out of frame.

Keep the product the brightest, sharpest thing in the frame. Props go softer, further back, or
partially cropped. If the scene starts to read as a still life with the pack somewhere in it, cut a
prop.

Sizes: `square_hd` for a feed post, `portrait_16_9` for a story or Reel cover.

## Banner composition

A wide frame where the product is the subject but the headline is the point.

State where the negative space goes — "the bottle sits in the right third, the left two-thirds an
uncluttered gradient wall" — and ask for that region to stay low in contrast and detail so type will
sit on it legibly. Say the space is empty. Do not ask the model to render the headline itself:
generate the plate clean and set the type in a design tool, where it will be sharp, on-brand and
editable.

Sizes: `landscape_16_9`, or `landscape_4_3` for a wider-than-tall email header.

## Seasonal restyle

An existing shot re-dressed for a moment — winter, a holiday, a sale, a new brand palette.

This is an edit, so read the `edit-instruction` entry from `genai_recipes` first. Change one axis:
palette, props and light. Keep the pack, the camera and the framing locked, and say so explicitly —
list what must not move. The most common failure is a prompt that re-describes the whole picture,
which the model reasonably reads as a request for a different picture.

Attach the original shot as the reference, and attach the original packshot alongside it when the
label is small in frame — the restyle pass is where fine label detail gets softened.

Size: whatever the source was.

## Flat-lay

Overhead, everything arranged on a plane.

Name the background material outright — linen, terrazzo, kraft paper — because "a flat-lay
background" gets you an invented texture that changes every run. Say the camera is directly overhead
and square to the surface; a few degrees of tilt is what makes a flat-lay look wrong without anyone
being able to say why.

Describe the arrangement in words a person could follow: the pack centred, three ingredients fanned
to its left, a folded cloth in the lower right corner. Keep light soft and near-shadowless, or commit
to one hard directional shadow — the half-measure reads as a composite.

Size: `square_hd`, or `portrait_4_3` when the arrangement is tall.

## Hands-on close-up

A hand holding, pouring, opening or presenting the product. **The highest-risk mode in this file.**

Hands are where generative models still fail most visibly: extra fingers, fused knuckles, thumbs on
the wrong side, a grip that no wrist could achieve. Reduce the surface area for failure:

- Keep the grip simple and static. A hand resting around a jar is far safer than fingers unscrewing a
  cap mid-turn.
- Let the hand be partly cropped or partly occluded by the product. Fewer visible fingers, fewer
  chances to get them wrong.
- Never stack two actions ("holding it while pointing at the label"). One action per generation.
- Say the fingers are relaxed and naturally spaced, the wrist at a natural angle.

**Always review the fingers before delivering.** Count them. This is the one mode where you check the
result twice — once for the label, once for the hand — and regenerating is normal rather than a sign
something went wrong. If two attempts both fail, move the hand further out of frame or switch to
in-context without a person.

Size: `portrait_4_3`, or `square_hd` for a feed post.

## Product lineup

The whole range in one frame — flavours, sizes, variants.

Models do not count. Asking for exactly seven bottles is a request, not a constraint, and the
result will confidently show six or eight. Work with that:

- Attach a reference for each variant, and give each one a role line naming its position: `Image 2
  (Cherry) -> second from the left`.
- Keep the line-up small. Three or four variants is reliable; beyond that, generate in halves and
  compose afterwards in a design tool.
- State one shared light, one shared surface and a consistent spacing, otherwise each bottle arrives
  lit like it came from a different shoot.
- Expect labels to bleed between neighbours — the same failure as two similar faces in one frame.
  Verify each pack individually against its reference.

When the range genuinely has to be complete and correct, the honest answer is a clean packshot per
variant plus a compositing step, not one heroic generation.

Size: `landscape_16_9`.

---

## Choosing between modes

Go by where the image will be used, not by the noun the user reached for:

- Marketplace listing, catalog, site tile → studio packshot
- Instagram or a blog header showing the product in use → in-context scene
- Anything that will carry a headline → banner composition
- An existing approved shot that needs a new mood → seasonal restyle
- Ingredients, kits, "what's in the box" → flat-lay
- Scale, texture, or a human moment → hands-on close-up
- A range page or a launch announcement → product lineup

When two fit, take the narrower one. If the user has named a placement ("for our Black Friday email
banner"), the placement decides.
