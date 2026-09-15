# Mode recipes

One assembled prompt per mode. Substitute the bracketed parts; keep everything else, including the
closing guard. All of them run on the Seedance reference-to-video lane with `generate_audio: true`,
`aspect_ratio: "9:16"`.

The reference numbering below assumes character = image 1, product (or outfit) = image 2. If the
user picked no character (`showcase`), the product becomes image 1 and every number shifts.

---

## talking-head

The default. Someone recommends the product to camera.

> Image 1 (Noor) -> identity lock: `<identity verbatim>`. The same face and the same skin tone in
> every frame, as described. Take build, proportions and hair from reference image 1, never its
> wardrobe. Image 2 (Sundown Tonic) -> product: the exact bottle, label artwork and proportions as
> in reference image 2, held in hand throughout with the front toward the lens. Reference image 2
> shows the product on its own: reproduce that exact product and ignore the background, surface,
> shadow and lighting of that photo completely.
>
> Vertical phone video, one continuous handheld take at arm's length, wide 28mm feel, soft neutral
> window daylight from the side, natural colour, fine grain. Noor sits on the edge of a linen sofa
> in a bright living room, wearing a plain white tee, holds the bottle at chest height with the
> label toward the lens, fingers wrapped around the neck and her thumb on the label edge. She looks
> straight into the lens and says, unhurried, stressing "actually": "Okay, this is the one I
> actually finish every single week." On "actually" she lifts the bottle a few centimetres so the
> label catches the light, then everything settles. The camera drifts a couple of degrees and
> corrects, reacting slightly late. The bottle stays rigid as it moves. Only her voice over quiet
> room tone; the bottle moves silently.
>
> The spoken words are audio and lip movement only — no on-screen text, subtitles, captions or
> words anywhere in the video.

**Duration** 5–6s. **Common failure**: the gesture is too big, and the clip reads as an ad.

---

## unboxing

A package is opened and the product comes into frame. The reveal is the event.

Replace staging and motion:

> ... Noor sits at a wooden kitchen table by a window, wearing a cream knit, the closed box flat on
> the table in front of her with both hands resting on the lid. She looks straight into the lens
> and says, excited but quiet, stressing "finally": "Okay, it finally came in, so let us open this
> together." On "finally" she lifts the lid and the bottle comes into frame, front toward the lens,
> then everything settles. The camera drifts a couple of degrees and corrects, reacting slightly
> late. The cardboard flexes and the lid gives with a soft give; the bottle stays rigid. Only her
> voice over quiet room tone and the single soft sound of the lid; nothing else is added.

**Duration** 6–8s — the reveal needs room. **Common failure**: the product is already visible at
frame 1, which kills the reveal. Say "the box is closed" explicitly.

---

## how-to

One step of using the product, demonstrated. Not the whole routine — one step.

> ... Noor stands at a bathroom counter in soft daylight, wearing a plain white tee, the bottle
> already open in her left hand with the cap resting on the counter, her right palm turned up. She
> looks straight into the lens and says, clearly and unhurried, stressing "much": "The bit everyone
> gets wrong is how much you actually use." On "much" she presses the pump once into her palm, then
> holds still. The camera drifts a couple of degrees and corrects, reacting slightly late. The pump
> gives and springs back; the bottle stays rigid. Only her voice over quiet room tone; the pump is
> the one soft sound.

**Duration** 6–8s. **Common failure**: two steps in one clip. The model blurs them together — pick
the single step the viewer gets wrong.

---

## review

A verdict, plus one piece of visible proof.

> ... Noor sits on the edge of a linen sofa in a bright living room, wearing a plain white tee,
> holds the bottle at chest height and turns it a few degrees toward the window. She looks straight
> into the lens and says, unhurried and level, stressing "expect": "Three weeks in, and here is the
> part I did not expect." On "expect" she tilts the bottle so the level of the liquid catches the
> light and stays visible, then settles. The camera drifts a couple of degrees and corrects,
> reacting slightly late. The bottle stays rigid; the liquid inside shifts with the tilt. Only her
> voice over quiet room tone; the bottle moves silently.

**Duration** 5–6s. **Common failure**: the proof is not visible. Name what the tilt reveals — a
level, a texture, a finish — or the gesture is empty.

---

## try-on

The garment is worn, not held. The product slot is usually empty here; the outfit is the subject.

> Image 1 (Noor) -> identity lock: `<identity verbatim>`. The same face and the same skin tone in
> every frame, as described. Take build, proportions and hair from reference image 1, never its
> wardrobe. Image 2 (Linen Set) -> outfit: exactly these garments, worn — the same colour, weave,
> cut and every detail as in reference image 2.
>
> Vertical phone video, one continuous handheld take at arm's length, wide 28mm feel, soft neutral
> window daylight from the side, natural colour, fine grain. Noor stands in a bright bedroom
> wearing the linen set, hands loose at her sides. She looks straight into the lens and says,
> clearly and upbeat, stressing "actually": "Okay, try-on haul, and this one is actually my
> favourite." On "actually" she turns roughly thirty degrees so the front of the garment catches
> the light, then settles back. The camera drifts a couple of degrees and corrects, reacting
> slightly late. The linen flexes and folds as she turns and the hem sways a moment late. Only her
> voice over quiet room tone; the fabric moves silently.
>
> The spoken words are audio and lip movement only — no on-screen text, subtitles, captions or
> words anywhere in the video.

**Duration** 5–6s. **Common failure**: a full spin. A thirty-degree turn holds the identity; a
360 rebuilds the face on the way round.

---

## showcase

No person, no hands. The product alone, and the camera does the moving.

> Image 1 (Sundown Tonic) -> product: the exact bottle, label artwork and proportions as in
> reference image 1. Reference image 1 shows the product on its own: reproduce that exact product
> and ignore the background, surface, shadow and lighting of that photo completely.
>
> Vertical video, one continuous handheld take, wide 28mm feel, soft neutral window daylight from
> the side, natural colour, fine grain. The bottle stands alone on a pale stone surface, front
> label toward the lens, no hands and no person anywhere in frame. The camera drifts a few
> centimetres closer and corrects, reacting slightly late; the bottle does not move. Quiet room
> tone with a faint room reflection; no music, no voice.
>
> No on-screen text, subtitles, captions or words anywhere in the video.

**Duration** 4–5s. **Common failure**: a hand wanders in. "No hands and no person anywhere in
frame" is not optional wording.

---

## problem-solution

Two beats in one take: the annoyance, then the fix. The most demanding mode — keep both lines
short.

> ... Noor stands at a bathroom counter in soft daylight, wearing a plain white tee, both hands
> empty and the counter cluttered, the bottle out of frame. She looks straight into the lens and
> says, flat and a little tired, stressing "year": "I did this every morning for a year." Then she
> reaches out of frame, brings the bottle in with the front toward the lens and says, warmer,
> stressing "this": "Then I tried this." Everything settles. The camera drifts a couple of degrees
> and corrects, reacting slightly late. The bottle stays rigid. Only her voice over quiet room
> tone; the bottle moves silently.

**Duration** 8–10s — two lines will not fit in five. **Common failure**: the tone does not change
between the lines. Give each line its own delivery note; that contrast is the whole mechanic.

---

## Adapting a mode

Change one thing at a time:

| Want | Change |
|---|---|
| A different vibe | the delivery note only ("flat and dry", "warm and quick") |
| A different room | the staging clause only; leave the light description alone |
| More energy | the stressed word and the gesture, never the camera |
| A second product | do not. Two products in one 6-second clip both come out wrong |
