---
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

Check whether the `genai_*` tools are present in this session. If they are, continue. If not, stop
and give the user the connect step:

- **claude.ai / Claude Desktop** — Settings → Connectors → *Add custom connector*, URL
  `https://mcp.rendrr.ai/mcp`. Sign-in is Google; there is no API key to paste.
- **Claude Code** — `claude mcp add --transport http rendrr https://mcp.rendrr.ai/mcp`

MCP access requires a **Pro plan or higher** on rendrr.ai.

## UX rules

Same as `rendrr-generate`: be brief, deliver the media URL plus one line, never dump JSON, ids or the
assembled prompt into chat, reply in the user's language, ask at most one question, and never invent
a model, a parameter or a product detail that no tool returned.

## Step 1 — Establish the product source

No source image, no product shot. One of these two must exist:

- **A packshot URL the user supplies.** It has to be publicly fetchable over https. There is no
  upload tool on this surface, so a file on their machine cannot be sent — ask for a hosted URL.
- **A saved item in their rendrr library.** Call `genai_library` (no arguments) and look for entries
  whose `src` is `"element"` — saved props, packshots and outfit references rather than ordinary
  generations. Read `name`, `note` (the description the reference was built from — reuse that
  wording), `tags` and `brand` to group a range, and `url` for the image itself. **A `url` beginning
  with `/` is relative**; prefix it with `https://app.rendrr.ai` before passing it to a generation.

A prop saved with a **front/back reference sheet** is the strongest anchor available: it shows both
sides of the pack, so nothing has to be improvised when the product turns in frame.

If neither source exists, say so plainly. A product shot without the product is just an image, and
that belongs to `rendrr-generate`.

## Step 2 — Read the house recipe

Call **`genai_recipes`** with `kind: "image"` — and again with `kind: "edit"` when you are altering an
existing shot. It returns rendrr's own per-use-case guidance, the same wording the studio enhances
prompts with. Two entries carry this work:

- **`product-shot`** — how to render the product as a clean, catalog-grade reference.
- **`character-scene`** — the placement pattern: one role line per attached reference, followed by a
  scene lock. Written around characters, it applies unchanged to an object.

Follow what comes back. The catalog is versioned server-side and outranks anything you remember from
an earlier session.

## Step 3 — Pick an edit-capable model

Call `genai_gateway_models` and take one whose **`edit` flag is `true`** — that flag means the model
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

`genai_enhance` can sharpen a thin brief — pass `prompt`, `kind` (`image`, or `edit` when changing an
existing shot) and `refs` set to the number of references you will attach. Skip it when the user
already wrote a detailed prompt.

## Step 5 — Generate with `genai_free`

```json
{ "model": "<edit-capable id from genai_gateway_models>",
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

## Shot modes

| Mode | Specify | Size |
|---|---|---|
| **Studio packshot** | plain seamless surface, even diffused light, straight-on or slight three-quarter angle | `square_hd`, `portrait_4_3` |
| **In-context scene** | a real surface and location, one or two supporting props, directional daylight | `square_hd`, `portrait_16_9` |
| **Banner composition** | product off-centre, deliberate empty space for the headline, calm tone where type will land | `landscape_16_9` |
| **Seasonal restyle** | keep the pack and the framing; change palette, props and light only | match the source |
| **Flat-lay** | overhead camera, the background material named, props arranged around the pack | `square_hd` |
| **Hands-on close-up** | tight crop, hands relaxed and partly out of frame, the product held still | `portrait_4_3` |
| **Product lineup** | the whole range on one surface, order stated left to right, a single shared light | `landscape_16_9` |

Images take `image_size`, not an aspect-ratio string: `square_hd` for a 1:1 feed post,
`landscape_16_9` for a 16:9 banner, `portrait_16_9` for a 9:16 story. Generate at the size the
placement needs — cropping a wide render down to vertical throws away the composition the model built.

Per-mode surfaces, lighting, camera and traps: `references/shot-modes.md`. Hands-on close-ups and
lineups are the two that fail most often; both have their own section there.

## Credits

Generations are charged to the signed-in user's own rendrr credits, and the response reports the real
charge in `credits`. Mention cost when the user asks, when a run is unusually expensive, or when a
call fails for insufficient credits. Failed generations are not charged.

## References

- `references/shot-modes.md` — surfaces, lighting, camera and framing for each mode
- `references/brand-fidelity.md` — holding label text, logos and colour true to the real product
