---
version: 1.0.0
name: rendrr-ugc-ads
description: >-
  Make UGC-style ad video with rendrr.ai — a creator-looking clip in which a
  character holds, wears, opens, demonstrates or reviews a real product and
  speaks one line to the lens. Use when: "make a UGC video", "UGC ad", "TikTok
  ad", "reel for my product", "unboxing video", "try-on video", "product review
  video", "how-to video with my product", "talking head with my product",
  "creator video", "ad with my avatar", "advertentie video", "maak een reel met
  mijn product". NOT for: a still image (use rendrr-generate or
  rendrr-product-shots), a character with no product or spoken line (use
  rendrr-characters), or a cinematic non-ad film (use rendrr-generate's
  director prompt).
---

# rendrr UGC Ads

One deliverable: a vertical clip that reads as something a creator filmed on a phone, with the
user's real product in it and their own character speaking. Everything below serves one rule:
**the clip has to look unproduced.** Polish is what makes a UGC ad fail.

> **The user already has footage?** Then this is not the skill. Editing an existing clip while
> keeping its performance, camera and timing is `rendrr-ad-multiplier`. This skill makes a clip
> from nothing.

## Step 0 — Connect

Check whether the rendrr MCP tools are present in this session — `generate`, `gateway_models`
and `library` are the ones that must be there. If they are, continue. If not, stop and give the
user the connect step:

- **claude.ai / Claude Desktop** — Settings → Connectors → *Add custom connector*, URL
  `https://mcp.rendrr.ai/mcp`. Sign-in is Google; there is no API key to paste.
- **Claude Code** — `claude mcp add --transport http rendrr https://mcp.rendrr.ai/mcp`

MCP access is included **from the Expert plan** (Expert or custom). The server's own refusal says
so and links to `/billing`.

## UX rules

Same as `rendrr-generate`: be brief, deliver the media URL plus one line, never dump JSON, ids or
the assembled prompt into chat, reply in the user's language, ask at most one question, and never
invent a model, a mode or a parameter that no tool returned.

Two more that are specific to ads:

- **Never write the spoken line for the user without showing it.** The line is the ad. Put it in
  the reply as a quoted line so they can correct it before the paid run.
- **One clip per run.** UGC is iterated, not batched — a bad hook is bad in all four copies.

## The modes

Every UGC brief is one of these. The mode decides the **shape of the clip**, not just the wording.
Same lane for all of them: Seedance reference-to-video with native audio.

| Mode | The clip is | Character | Product held | Spoken line |
|---|---|---|---|---|
| `talking-head` | someone recommending it to camera | required | yes | one line, 8–14 words |
| `unboxing` | a package opened, product revealed | required | yes, revealed mid-clip | one line, on the reveal |
| `how-to` | one step of using it, demonstrated | required | yes, in use | one instruction line |
| `review` | a verdict with one piece of proof | required | yes | verdict line + proof gesture |
| `try-on` | a garment worn and shown | required | worn, not held | one line, on the turn |
| `showcase` | the product alone, no person | none | no hands | no speech — sound design only |
| `problem-solution` | the annoyance, then the fix | required | appears at the turn | two short lines |

### Picking the mode

Pick by what the viewer sees happen, not by the user's noun.

- "recommend it / talk about it / say something about it" → `talking-head` (**the default**)
- "just got it / arrived / open it / package / mail" → `unboxing`
- "show how / tutorial / how do you use / demonstrate / apply" → `how-to`
- "honest / my opinion / worth it / verdict / review" → `review`
- "wear / outfit / fit check / haul / does it fit" → `try-on`
- "no person / just the product / product video / clean" → `showcase`
- "annoying / struggle / fix / before and after / this is why" → `problem-solution`

Tie-breakers:

- "unboxing review" → `unboxing` (the reveal is the visual event; the verdict is just the line)
- "try-on haul with my opinion" → `try-on` (what is worn wins over what is said)
- "how-to that also sells it" → `how-to` (the demonstration is the structure)
- "review but no one on camera" → `showcase` (no character means no review mode)

## The inputs

Four library entities, picked from the user's own rendrr library. Order matters — it is the
reference order in the prompt.

| Slot | Required | What it anchors | Library tab |
|---|---|---|---|
| character | all modes except `showcase` | identity | Characters |
| product | all modes except `try-on` | the exact pack, label and proportions | Elements |
| outfit | `try-on` (else optional) | the exact garments, worn | Clothing |
| scene | optional | the location and its light | Scenes |

**The 3-reference cap.** Seedance takes 4 references and the server appends the character's
face-free Rendrr Soul board as the fourth. So at most **three** of the slots travel as images; a
fourth entity travels as text instead. When the user has picked four, drop the scene to text —
a location survives a text description far better than a garment or a pack does.

**Never attach a character's face yourself.** Attach the saved character; the server swaps every
face-bearing image for the headless body sheet, appends the feature board, and adds the identity
text. A raw photoreal face in the references is refused by the person filter. See
`rendrr-characters` for how that lane works and what to do when a run is refused.

## The prompt shape

Same six parts in every mode; the mode changes part 3 and part 5.

1. **Role lines** — one per attached reference, in reference order:
   `Image 1 (<name>) -> identity lock: <identity phrasing verbatim>. The same face and the same
   skin tone in every frame.`
   `Image 2 (<product>) -> product: the exact <product>, label artwork and proportions as in
   reference image 2, held in hand throughout with the front toward the lens.`
   Add, for the product: `Reference image 2 shows the product on its own: reproduce that exact
   product and ignore the background, surface, shadow and lighting of that photo completely.`
2. **Frame** — `Vertical phone video, one continuous handheld take at arm's length, wide 28mm
   feel, soft neutral window daylight from the side, natural colour, fine grain.` Camera behaviour,
   never a device name.
3. **Staging** — the mode's beat (see the table below), with the grip named: which hand, which
   contact points, which side of the pack faces the lens.
4. **Dialogue** — one line, 8–14 words, spoken to the lens, with a delivery note:
   `looks straight into the lens and says, unhurried, stressing "<word>": "<line>"`.
5. **One motion + material + sound** — the gesture lands on the stressed word, then settles. Say
   how the product behaves (`soft fabric flexes and the straps sway` / `the bottle stays rigid`)
   and direct the sound (`only her voice over quiet room tone; the product moves silently`).
6. **Guard, verbatim** — `The spoken words are audio and lip movement only — no on-screen text,
   subtitles, captions or words anywhere in the video.`

### The beat per mode

| Mode | Part 3 (staging) | Part 5 (the one motion) |
|---|---|---|
| `talking-head` | holds the product at chest height, label toward the lens | lifts it a few centimetres on the stressed word, then settles |
| `unboxing` | the closed box on the table in front of them, both hands on the lid | lifts the lid on the stressed word and the product comes into frame, then settles |
| `how-to` | the product already in use — cap off, pump depressed, garment half on | completes the one step on the stressed word, then holds still |
| `review` | holds the product at chest height, turns it a few degrees toward the light | tilts it on the stressed word so one named detail catches the light, then settles |
| `try-on` | wearing the garment, standing, hands loose at the sides | turns roughly thirty degrees on the stressed word so the front catches the light, then settles back |
| `showcase` | the product alone on a surface, no hands, no person in frame | the camera drifts a few centimetres closer and corrects; the product does not move |
| `problem-solution` | the annoyance visible first, product out of frame | the product enters frame on the turn word, and everything settles |

## Writing the line

The line is the ad. Rules that hold across every mode:

1. **8–14 words.** A three-word line is read oddly by the model — the delivery has nowhere to go.
2. **Write it the way it is said.** Hyphenate compounds ("try-on haul"), spell out numbers the way
   a person says them, keep the contractions.
3. **Name the stressed word** and make the gesture land on it. This is the single lever that makes
   a delivery sound spoken rather than read.
4. **Open on a real sentence, not a slogan.** "Okay, this is the one I actually finish every
   week" beats "Introducing our best-selling serum".
5. **No claim the product cannot make.** A generated creator saying a medical or financial claim
   is the user's legal problem, not the model's. If the brief asks for one, write the line without
   it and say once that you left it out.

Openers that survive the format, per mode:

- `talking-head` — "Okay, this is the one I actually finish every single week."
- `unboxing` — "Okay, it finally came in, so let us open this together."
- `how-to` — "The bit everyone gets wrong is how much you actually use."
- `review` — "Three weeks in, and here is the part I did not expect."
- `try-on` — "Okay, try-on haul, and this one is actually my favourite."
- `problem-solution` — "I did this every morning for a year." / "Then I tried this."

## Settings

`aspect_ratio: "9:16"`, `resolution: "1080p"` (`"720p"` for drafts), `duration` 5–8 for a single
line, 8–10 when two lines or a reveal has to fit. `generate_audio: true` — that is what produces
the voice and the lip movement. One continuous take, at or under 10 seconds.

`showcase` is the exception: `generate_audio: true` still, but with no spoken line the model fills
the track with room tone and product sound, which is what you want.

## Running it

Two routes, and the choice is the user's:

- **In the app** — rendrr Studio → Video tab → the **UGC** template. Slots, mode, scenario chips
  and the pills are all there, and the prompt is assembled by the same recipe as below. Point the
  user here when they want to iterate visually.
- **Over MCP** — `generate`, with the shape in `rendrr-generate` under "UGC talking-head / try-on
  recipe". Use this when you are assembling the clip for them.

Deeper guidance lives in the server itself: call `recipes` with `kind: "video"` and read the
`ugc-talking-head` entry — that is the same text the studio's auto-enhancer injects, so it is
always current.

## After the run

- **Save what worked.** `library_save` the output with a name and a tag, and the clip joins the
  tag pool that flows and scheduled posts read from.
- **Schedule it, never publish it.** `post_draft` puts a post in the approval queue; there is no
  approve tool on this surface by design.
- **Iterate on one axis.** A UGC clip that missed usually missed on one of three things: the line,
  the gesture, or the light. Change one, rerun, compare. Changing all three teaches you nothing.

## Reference docs

- `references/mode-recipes.md` — the full assembled prompt for each mode, with a worked example
- `references/realism.md` — why AI UGC reads as fake, and the specific fixes
