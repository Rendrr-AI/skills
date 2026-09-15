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

This is an edit, so read the `edit-instruction` entry from `recipes` first. Change one axis:
palette, props and light. Keep the pack, the camera and the framing locked, and say so explicitly —
list what must not move. The most common failure is a prompt that re-describes the whole picture,
which the model reasonably reads as a request for a different picture.

Attach the original shot as the reference, and attach the original packshot alongside it when the
label is small in frame — the restyle pass is where fine label detail gets softened.

Named aesthetics are stronger anchors than a description of one: clean girl, cottagecore, quiet
luxury, dark academia, Y2K. Pair one with the occasion (Christmas, Valentine's, Black Friday) and the
"keep the pack, camera and framing" clause; that is the whole prompt.

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

Write the grip physically (paste into the scene block and adapt): "held in the right hand at chest
height, fingers wrapped around the neck, thumb resting on the label edge, the wrist angled under its
weight, label facing the lens, the lower third of the label hidden behind the fingers; the hand
still, fingers relaxed and naturally spaced." Contact, weight, orientation, one occlusion — that is
what keeps a product in a hand instead of hovering beside one. Floating, hovering and levitating are
rendered on request; in a hands-on prompt none of them appear.

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

## Pinterest pin

Vertical 2:3, and the aesthetic is the point — Pinterest rewards a mood, not a product listing. The
pack sits inside a styled still life rather than being the whole frame.

- Frame vertical 2:3, product occupying roughly a third of the height, placed off-centre.
- Build a small still life around it: two or three props that belong to the same world (a linen
  napkin, a cut fruit, a stem of eucalyptus), never more.
- Soft directional daylight, real shadows, a muted palette that leaves room for a text overlay at
  the top or bottom.
- Say "space left clear at the top third" if the user will add a headline in Pinterest itself.

Ask for the palette if the brand has one; a pin that clashes with the feed it lands in gets scrolled.

---

## Social carousel

Three to ten frames that read as one set. The failure mode is not a bad frame, it is ten frames
that look like ten different shoots.

- Fix everything shared **once** and repeat it verbatim in every frame: the same surface, the same
  light direction and quality, the same camera height, the same palette.
- Vary exactly one axis across the set — the angle, the prop, or the crop. Not several.
- Generate them one at a time and carry the winning scene block forward unchanged; changing the
  wording between frames is what breaks the set.
- Frame 1 has to work alone, because most viewers see only that one. Put the product largest there.

Square (`square_hd`) unless the user says otherwise — it is the only ratio that survives every
platform's crop.

---

## Ad creative pack

A coordinated set of static ad variants for paid social. Same product, same offer, deliberately
different openings, so the buying platform has something to test against.

- Ask what the offer and the angle are before generating anything. An ad pack without a hook is
  just a lookbook.
- Produce three to five variants that differ on the **visual hook**, not on decoration: product
  alone on colour · product in use · product with its result · product at scale next to something
  familiar · product mid-motion.
- Keep the pack recognisably one campaign: one palette, one light, one treatment.
- Leave a clear zone for the headline in every variant, in the same place, so one text layer fits
  all of them.
- Never bake the headline, price or claim into the image. Copy belongs in the ad manager, where it
  can be edited without a regeneration — and where it is legally the user's text.

---

## Model try-on

The product worn or used by a generated person. Wardrobe and cosmetics mostly; anything held or
worn where the human is what sells it.

- This is the one product mode with an identity in it. If the user has a saved character, use it
  and follow `rendrr-characters` — the reference roles and the faceless lane apply here too.
- Without a character, describe the person in the least specific terms that still serve the brief
  (build, hair length, approximate age) and let the model choose the face. A vaguely described
  person is stable; a precisely described one that is not a saved character drifts between runs.
- The garment is the subject: give it its own role line, name the colour, weave and cut, and say
  "exactly these garments, worn".
- Crop deliberately. A three-quarter crop that ends above the chin keeps attention on the product
  and removes the whole class of face problems.
- For motion, hand off to `rendrr-ugc-ads` (`try-on` mode) — this mode is stills only.

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
- Pinterest, a pin, a vertical moodboard → Pinterest pin
- A swipeable multi-slide post → social carousel
- Paid social, Meta/TikTok ads, "a few versions to test" → ad creative pack
- Worn, on a body, a lookbook, virtual try-on → model try-on

When two fit, take the narrower one. If the user has named a placement ("for our Black Friday email
banner"), the placement decides.

### Tie-breakers

The cases that come up often enough to settle in advance:

| The brief | Mode | Why |
|---|---|---|
| "Pinterest pin of my product on a kitchen counter" | Pinterest pin | the platform wins over the setting |
| "Hero banner showing the product in use" | banner composition | the format wins over the scene |
| "Carousel of my product in different rooms" | social carousel | multi-slide wins over the setting |
| "Close-up of someone applying the serum" | hands-on close-up | the specific genre wins |
| "Ads with a model wearing it" | ad creative pack | the placement wins over the subject |
| "Autumn version of this shot" | seasonal restyle | an existing image wins over everything |

