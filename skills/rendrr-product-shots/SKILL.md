---
version: 1.0.0
name: rendrr-product-shots
description: >-
  Turn a real product photo into finished commercial imagery with rendrr.ai —
  studio packshots, in-context lifestyle scenes, banners and ad visuals — while
  keeping the label, logo and pack text faithful to the actual product. Use
  when: "product photo", "packshot", "lifestyle shot of my product", "hero
  banner", "ad visual with my bottle/jar/box", "social product post", "place my
  product in a scene", "product on a plain background", "flat-lay of my
  product", "seasonal version of this product shot", "shoot my whole range
  together". NOT for: one-off generations with no real product to stay faithful
  to — use rendrr-generate; a recurring PERSON's face or identity, character
  sheets and AI-influencer work — use rendrr-characters.
---

# rendrr Product Shots

Commercial imagery built around a product the user actually sells, placed in a scene it was never
photographed in. One goal governs every step: **the product survives the generation.** A gorgeous
image with a re-typeset label is a failed job.

## Step 0 — Connect

Check whether the rendrr MCP tools are present in this session. If they are, continue. If not, stop
and give the user the connect step:

- **claude.ai / Claude Desktop** — Settings → Connectors → *Add custom connector*, URL
  `https://mcp.rendrr.ai/mcp`. Sign-in is Google; there is no API key to paste.
- **Claude Code** — `claude mcp add --transport http rendrr https://mcp.rendrr.ai/mcp`

MCP access is included **from the Expert plan** (Expert or custom; Pro buys templates and
community, not this connection). The server's own refusal says the same thing and links to
`/billing`.

## UX rules

Same as `rendrr-generate`: be brief, deliver the media URL plus one line, never dump JSON, ids or the
assembled prompt into chat, reply in the user's language, ask at most one question, and never invent
a model, a parameter or a product detail that no tool returned.

## Step 1 — Establish the product source

No source image, no product shot. One of these two must exist:

- **A packshot URL the user supplies.** It has to be publicly fetchable over https. There is no
  upload tool on this surface, so a file on their machine cannot be sent — ask for a hosted URL.
- **A saved item in their rendrr library.** Call `library` (no arguments) and look for entries
  whose `src` is `"element"` — saved props, packshots and outfit references rather than ordinary
  generations. Read `name`, `note` (the description the reference was built from — reuse that
  wording), `tags` and `brand` to group a range, and `url` for the image itself. **A `url` beginning
  with `/` is relative**; prefix it with `https://app.rendrr.ai` before passing it to a generation.

A prop saved with a **front/back reference sheet** is the strongest anchor available: it shows both
sides of the pack, so nothing has to be improvised when the product turns in frame.

If neither source exists, say so plainly. A product shot without the product is just an image, and
that belongs to `rendrr-generate`.

### Saving a packshot as a reusable library prop

**If the user has the real packshot (a clean render or cut-out on transparent/white), save THAT.**
Trim it to the bottle, place it on the same neutral mid-grey the Props maker uses, add a soft contact
shadow, and register it as-is. Proven in production (Sep 2026) on a real 700 ml liqueur bottle: two Nano Banana Pro
re-renders of the original made the bottle ~20% too wide and the neck too short, even with explicit
proportion instructions, and every generation that used that sheet as its reference inherited the
distortion. An AI re-render is an approximation; the model then copies the approximation faithfully.

Only when there is **no** clean packshot (a scene photo, a hand, a gift box in frame) recreate it as a
**single-panel product reference sheet** first. Use an edit-capable model with the photo attached and
this prompt shape: *"Single-panel product
reference sheet: one straight-on view of the object, centred, filling the frame with a small even
margin. Clean neutral mid-grey backdrop, soft, even ambient light… Use the reference image ONLY to
identify the exact object/product (same shape, materials, colours, labels and proportions). Recreate
THAT object alone… output ONLY the isolated object, nothing else."* (This is the same prompt the
in-app Props maker assembles.) Generate it at `portrait_16_9` — the makers' house default, and the
shape the item cards render best. If the source photo shows more than the product (gift box, hand,
scene), name the subject explicitly: "The object is the bottle only — leave out the box."

Then register the result with **`library_save`**: pass the generation's url, the name (match
the siblings' naming pattern), `tags` (bucket tag `prop` + the range's pool tag) and `desc` (the
official product/tasting notes). `library_update` edits name/tags/desc on an existing item.
Both are caller-scoped, so they work identically on a customer's own account over their OAuth
connection. Flows can be read and built the same way: `flows` / `flow_get` /
`flow_save` — flow_save runs the editor's own validation, and any node field that validation
does not know is silently dropped, so read a similar flow with flow_get first and mirror its node
shapes exactly.

**Tags drive flows.** A flow source node set to a tag is a *living pool*: every library item that
carries that tag automatically joins the pool on the next run, and Randomize mode rolls one item per
run. So when adding a product to an existing range, give the new item exactly the same tag as its
siblings (check the siblings' `tags` via `library` first) — that is all it takes for scheduled
flows to start using it. Matching the siblings' naming pattern and putting the official tasting/
product notes in the item description pays off twice: caption assistants read the description, so
the post copy quotes real product facts instead of inventing them.

## Step 1b — Triage the brief

Ask the fewest questions that still let you pick a mode and a size. Which questions those are
depends on what the user already handed over, so read the situation first.

**They uploaded or named a product and asked for "some images".** Mode is open; ask three, as
labelled options, never open-ended:

1. How many — 1, 3 or 5?
2. What feel — clean studio, in a real setting, conceptual, or with a person?
3. Where does it go — webshop, Instagram, Pinterest, paid ads, or a site banner?

**They uploaded a product and named the use case** ("a Pinterest pin", "banner for the Black
Friday mail", "ads to test"). The mode is already decided — do not re-ask it. Ask only the gaps:
how many variants, and what the offer or mood is.

**They have no product photo.** Ask for one first, in one line, and say why: a real photo is the
difference between their product and a plausible lookalike. If they cannot supply one, get four
things — category, packaging form, colour, one distinctive feature — and say once that the pack
will carry no wordmark. Then hand off to `rendrr-generate`; without a source this is not a
product shot.

**They pointed at an existing image and want it changed.** This is an edit, not a new shot. Skip
straight to the seasonal-restyle path in `references/shot-modes.md` and change one axis.

Skip any question whose answer is already obvious from the conversation, the uploaded file, or a
saved library item. Four questions is the ceiling; two is usually enough.

## Step 2 — Read the house recipe

Call **`recipes`** with `kind: "image"` — and again with `kind: "edit"` when you are altering an
existing shot. It returns rendrr's own per-use-case guidance, the same wording the studio enhances
prompts with. Two entries carry this work:

- **`product-shot`** — how to render the product as a clean, catalog-grade reference.
- **`character-scene`** — the placement pattern: one role line per attached reference, followed by a
  scene lock. Written around characters, it applies unchanged to an object.

Follow what comes back. The catalog is versioned server-side and outranks anything you remember from
an earlier session.

## Step 3 — Pick an edit-capable model

Call `gateway_models` and take one whose **`edit` flag is `true`** — that flag means the model
accepts source images. A text-to-image-only model quietly ignores `image_url`, and that single
mistake is what produces a convincing bottle wearing a label nobody printed.

## Step 4 — Compose the prompt

Three blocks, in this order:

1. **Reference roles** — one line per attached image: `Image 1 (<name>) -> product: the exact pack,
   label artwork and proportions`. Say what each reference is for; labelling beats ordering.
2. **The scene** — surface, backdrop, lighting direction and quality, camera height and angle, and
   where the product sits in the frame. This block is the only part you are inventing.
3. **The fidelity clause** — reproduce the label artwork, wordmark and every character of the pack
   text exactly as they appear in the reference; never re-letter, re-typeset, translate or design
   anything new.

Do not re-describe the product beyond what the reference and its `note` already state. A second
description competes with the reference instead of reinforcing it.

`enhance` can sharpen a thin brief — pass `prompt`, `kind` (`image`, or `edit` when changing an
existing shot) and `refs` set to the number of references you will attach. Skip it when the user
already wrote a detailed prompt.

## Step 5 — Generate with `generate`

```json
{ "model": "<edit-capable id from gateway_models>",
  "prompt": "<role lines> <scene> <fidelity clause>",
  "input": { "image_urls": ["<front reference>", "<back or detail reference>"],
             "image_size": "square_hd", "num_images": 1 } }
```

`image_url` takes a single reference, `image_urls` a list. Two or three is the working range — beyond
that the constraints conflict, and a model settles conflicts by averaging them.

## Step 6 — Deliver

The image URL plus one line of context. Surface the response `note` when the server adjusted a
setting. Then **read the pack text in the result against the reference before you present it**. If a
character is wrong, say so rather than shipping it quietly and hoping.

Offer exactly one variation pass — warmer light, wider crop, darker surface. Do not spiral through
variants nobody asked for.

When the user asks for a set of N images, each image changes ONE named axis — light, camera angle,
surface or palette — with the pack, references and fidelity clause identical, and you say which axis
each one changed. N seeds of one prompt are not a set.

## Shot modes

| Mode | Specify | Size |
|---|---|---|
| **Studio packshot** | plain seamless surface, even diffused light, straight-on or slight three-quarter angle | `square_hd`, `portrait_4_3` |
| **Marketplace secondary image** (Amazon/bol) | square 1:1, product exact from the reference, ONE big headline (3 short lines, caps + one script word) or a fixed layout per type: brand story · tasting notes · serve suggestion · production/infographic · lifestyle; text ≤20% of the image, no watermark/URL/age badge; take only the COMPOSITION from an example, never its brand look; font named explicitly | `square_hd` — the studio template "Secondary Product Images" has the type cards + font chips ready |
| **In-context scene** | a real surface and location, one or two supporting props, directional daylight | `square_hd`, `portrait_16_9` |
| **Banner composition** | product off-centre, deliberate empty space for the headline, calm tone where type will land | `landscape_16_9` |
| **Seasonal restyle** | keep the pack and the framing; change palette, props and light only | match the source |
| **Flat-lay** | overhead camera, the background material named, props arranged around the pack | `square_hd` |
| **Hands-on close-up** | tight crop, hands relaxed and partly out of frame, the product held still | `portrait_4_3` |
| **Product lineup** | the whole range on one surface, order stated left to right, a single shared light | `landscape_16_9` |
| **Pinterest pin** | vertical still life, product off-centre at ~1/3 height, muted palette, top third left clear | `portrait_4_3` |
| **Social carousel** | one shared surface/light/height across every frame, exactly one axis varied | `square_hd` |
| **Ad creative pack** | 3–5 variants differing on the visual hook, one palette, headline zone in the same place | `square_hd`, `portrait_16_9` |
| **Model try-on** | the garment as its own role line, a loosely described person, crop above the chin | `portrait_4_3` |

Images take `image_size`, not an aspect-ratio string: `square_hd` for a 1:1 feed post,
`landscape_16_9` for a 16:9 banner, `portrait_16_9` for a 9:16 story. Generate at the size the
placement needs — cropping a wide render down to vertical throws away the composition the model built.

Per-mode surfaces, lighting, camera and traps: `references/shot-modes.md`. Hands-on close-ups and
lineups are the two that fail most often; both have their own section there.

A product HELD in video — talking-head, try-on, unboxing, how-to, review — is `rendrr-ugc-ads`.
It uses the same product role line and the same grip wording as `references/shot-modes.md`, and
adds one spoken line and one motion. Hand over there rather than assembling a video prompt here.

## Credits

Generations are charged to the signed-in user's own rendrr credits, and the response reports the real
charge in `credits`. Mention cost when the user asks, when a run is unusually expensive, or when a
call fails for insufficient credits. Failed generations are not charged.

## References

- `references/shot-modes.md` — surfaces, lighting, camera and framing for each mode
- `references/brand-fidelity.md` — holding label text, logos and colour true to the real product
