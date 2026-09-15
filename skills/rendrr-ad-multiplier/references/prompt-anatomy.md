# Anatomy of a production edit prompt

This is not a template someone invented. It is read off a real Seedance video-edit prompt that
@barchevskaia.socials showed full-screen in [reel
`Dce1MYEIKF-`](https://www.instagram.com/reel/Dce1MYEIKF-/) (published 25 Aug 2026, read 4 Sep
2026; the prompt is on screen at **00:11** and **00:14**). The edit it produced: same woman, same
performance, same framing — a different outfit, a different wall colour, and a matcha splash that
rises out of her mug and freezes in mid-air.

Full study, with the numbers and the second corroborating source:
`D:/video-learn/studies/video-edit — één opname naar meerdere creatives (2 reels).md`.

---

## What the original does, block by block

### 1. A timeline on milliseconds

```
00:00:00.052 — SPLASH BEGINS
00:00:00.052–00:00:00.200   the matcha rises upward, coherent, natural fluid deformation
00:00:00.200–00:00:01.042   the upward-splashed formation freezes completely in mid-air
00:00:01.042 — RELEASE      it loses its suspended state and falls straight down under gravity
```

Not "a splash". Four named moments with a duration each. A timed event described as a single noun
comes back as a soft, floaty approximation that starts whenever the model feels like it.

### 2. Physics per phase, in material terms

> realistic fluid shape; realistic droplets and suspended liquid; natural surface tension; realistic
> transparency and highlights; no artificial CGI appearance; **no motion blur while frozen**; **no
> dripping or falling during this frozen interval**.

Half of these are negatives attached to a specific phase. "No motion blur while frozen" only makes
sense because phase 3 exists.

### 3. A register line

> The effect must look like a high-end photorealistic practical liquid VFX shot, not animation.

One sentence, and it does real work: it tells the model which visual tradition to sample from.

### 4. The preserve list — the load-bearing block

Twelve lines, one thing each:

> the original woman's appearance and identity; facial expression and eye movement; body position
> and movement; hand position and grip on the mug; clothing; background; camera perspective and lens
> characteristics; exposure and lighting; shadows and reflections; original video motion and timing.
>
> **Do not alter anything unrelated to the matcha effect.**

Note how specific these are. Not "keep the person" but *hand position and grip on the mug*. Not
"keep the shot" but *camera perspective and lens characteristics*. Each line names a thing that a
video model will otherwise quietly re-decide.

### 5. Object consistency

> The glass mug must remain physically consistent throughout the entire shot. Reflections and
> refractions on the glass must react naturally to the matcha movement. The matcha must interact
> correctly with the inside rim of the mug at the moment it splashes upward. **The liquid should
> appear to originate from inside the mug rather than appearing or teleporting into existence.**

The last sentence is the one that separates a convincing effect from a sticker. New matter has to
come from somewhere in frame.

### 6. Negative constraints — thirteen lines

> Do not change the mug. Do not change the amount of matcha before the splash. Do not change the
> woman's appearance. Do not change her hands or fingers. Do not change the background. Do not add
> objects. **Do not add text or graphics.** Do not create extra cups or glasses. Do not change the
> camera angle. Do not introduce camera shake. Do not make the frozen matcha wobble, drip, morph or
> slowly move. Do not make the splash look like smoke, paint, slime, dust or particles. Do not
> create an artificial CGI look. Do not alter the original video except for the specified matcha
> fluid effect.

Several of these repeat the preserve list as a prohibition. That redundancy is deliberate and worth
copying — the two blocks fail in different ways.

---

## The transferable ratio

Counted in the original: roughly **one third** of the prompt describes the change and **two thirds**
describe what must not move. If a draft edit prompt is mostly about the new thing, it is not an edit
prompt yet.

---

## The second source, and where it corrects the first

`neurover.io — Same Scene, One Prompt` (5-page PDF, read 4 Sep 2026, kept at
`D:/video-learn/docs/seedance_edit_guide.pdf`), the published prompt behind
[@neuro_ver's SPEEDFORCE reel](https://www.instagram.com/reel/DclAzIJzfJ9/) — the Quicksilver
kitchen scene repainted into a birthday party. It contradicts the reel above on two points, and
the reconciled rule is sharper than either source alone. Both are already applied in `SKILL.md`;
this is the reasoning.

**Timecodes.** The guide: *"Never write timecoded shot breakdowns in Edit mode. The model reads
them as a storyboard and starts rebuilding the montage. This single mistake destroys more Edit runs
than anything else."* The reel's prompt nonetheless used a millisecond timeline and worked — because
it timed the **physical phases of one event inside one continuous shot**, not which shot shows what.
Segment the event, never the edit.

**Negatives.** The guide: *"Protect other people with a positive statement, not a prohibition.
'Everyone keeps their original face' works. 'Don't put my face on anyone else' does the opposite —
negative instructions about frame content tend to summon what they forbid."* The reel's thirteen
negatives survive that test because they are almost all about **rendering** (no wobble, no CGI look,
not like smoke or slime), not about frame content. Negatives constrain the render; preservations
constrain the content.

### What only the guide has

- **Write it in Chinese.** *"Seedance is trained on Chinese-language production documentation.
  Chinese prompts are followed more precisely and pass moderation more smoothly."* The published
  prompt is entirely Chinese with an English line-by-line gloss.
- **Open with 编辑 ("edit"), never "reference".** Reference wording makes the model treat the clip
  as inspiration and generate something new. One word between an edit and a new film.
- **Hard limits:** source capped at **20 seconds** in Edit mode, one to five reference files,
  duration matched to the source exactly, start at **480p** and raise it once the result is right.
- **A character sheet beats a single photo** — three angles plus a full body on one image. Identity
  survives close-ups, back views and motion blur far better. This is exactly what a rendrr character
  sheet already is, so attach the sheet rather than a portrait.

### The troubleshooting table

| Symptom | Cause and fix |
|---|---|
| The montage changed — different cuts, people in new positions | Scene descriptions or timecodes crept in. Strip them; Edit mode takes a replacement list and a preserve list, nothing else |
| Your face appeared on other characters | The preserve block is too weak, or you wrote a prohibition instead of a preservation. State it positively |
| Some props replaced, others missed | Global rules get applied selectively. Give the replacement a **physical** description and add coverage wording: *every one of them, at any second, centre frame or edge, sharp or blurred* |
| Only the colour changed, the room is still the original | Grading alone will not sell a new location. List actual objects — tablecloths, paper plates, gift boxes. **Material beats grade** |
| A prop appears in one shot and vanishes in the next | The model does not carry objects across a cut. Say explicitly that once it is on, it stays on in every following shot |
| An action got rebuilt instead of repainted | Open that instruction with a preservation clause (*keep his original hand movement and trajectory*), then the movement, then the material swap. Without the opening clause, describing an action reads as a request for a new one |
| Identity drifts in wide or overhead shots | Faces hold up worst in extreme wide shots, overhead angles and upside-down framing. Split the clip into two generations and rejoin in the editor |

### The caution that comes with it

*"Recognisable film footage stays recognisable after an edit pass. What plays fine as a technique
demo is a different proposition as commercial work."* The SPEEDFORCE demo runs on copyrighted studio
footage. For client or brand work the source has to be **footage the user owns**. Say this once when
someone brings a film clip; do not build the variant set on it.

---

## Adapting it

Swap block 1 and 2 for the operation at hand and leave 3–6 nearly untouched:

- **replace-product** — block 2 becomes the role line for the new packshot plus "the bottle in her
  right hand becomes the exact product in reference image 1, same position, same grip, same scale".
  Blocks 3–6 stay as they are, plus "do not change her hand position or the way it is held".
- **replace-person** — block 2 names the new person from their reference and adds the global
  exclusion: "the original person does not appear anywhere in the video, including through cuts,
  occlusions, reflections and shadows". Remove "appearance and identity" from the preserve list —
  everything else in it stays, which is the point.
- **change-background** — block 2 names the new location. Add "the subject's position in frame,
  scale and the direction of the key light are unchanged" to the preserve list, or the person will
  drift and relight.
- **remove-element** — block 2 says what goes and, crucially, **what is behind it**. A removal with
  no described background gets filled with invention.
