# Realism

Why an AI UGC clip reads as fake, ranked by how often it is the actual cause. Each one has a fix
that goes in the prompt — none of them need a different model.

## 1. Too much motion

The single biggest tell. A real creator holding a phone at arm's length barely moves; a generated
one waves, gestures, walks and turns because the prompt asked for "energetic".

**Fix.** Exactly one gesture per clip, tied to the stressed word, followed by the word *settles*.
Everything else holds. If the brief wants energy, put it in the delivery note and the stressed
word, not in the body.

This is also the pipeline the creators who do this well describe out loud: a still they approve
first, minimal-motion image-to-video second, upscale third. Motion is the step you spend the least
on, not the most.

## 2. The face drifts

Video models re-invent a face every second they are not held to one. Skin tone goes first — a warm
key light and the character comes back three shades different.

**Fix.**

- State the skin tone from the identity text, in words: `fair, light skin tone exactly as described`.
- Light with **soft neutral daylight from the side**. Golden hour, warm backlight and coloured
  practicals all re-tint the face.
- Never re-describe the face beyond the identity line. Two descriptions of one face is two faces.
- Keep the turn under about thirty degrees. A full spin rebuilds the face on the way round.

## 3. The product is a cutout

The pack stays perfectly rigid while the hand moves, or the label re-typesets itself into
plausible-looking nonsense.

**Fix.**

- Name the contact points: which fingers, which edge, which side faces the lens.
- Say how the material behaves — `soft ribbed fabric flexes and the straps sway a moment late`,
  `the bottle stays rigid`, `the cardboard gives`. Without this the object hangs in the hand.
- Keep **one side** toward the lens for the whole clip. Turning a pack over makes the model invent
  a back that does not exist.
- Add the fidelity clause: reproduce the label artwork and wordmark exactly as in the reference,
  and ignore that photo's background, surface and lighting completely.

## 4. The voice is read, not spoken

A short line delivered flat, with the stress in the wrong place.

**Fix.**

- 8–14 words. Below eight the model has nowhere to put the delivery.
- Write it phonetically-as-spoken: hyphenate compounds ("try-on haul"), keep contractions.
- Always name the stressed word, and land the gesture on it.
- Give a delivery note: pace plus tone, two words is enough — `unhurried, warm`.

## 5. Sound effects nobody asked for

The model adds a whoosh to every gesture and a swell under the line.

**Fix.** Direct the audio explicitly: `Only her voice over quiet room tone; the product moves
silently.` One sentence, and it holds.

## 6. On-screen text

Captions, subtitles and floating wordmarks appear unbidden, and they are always slightly wrong.

**Fix.** Close every prompt with the guard, verbatim: *The spoken words are audio and lip movement
only — no on-screen text, subtitles, captions or words anywhere in the video.* Add the caption in
the editor afterwards if the platform needs one.

## 7. It looks lit

Studio lighting, a clean backdrop, a colour grade. Correct for a commercial, fatal for UGC.

**Fix.** `Soft neutral window daylight from the side, natural colour, fine grain, no colour grade.`
Describe the camera as *behaviour* — handheld, drifting a couple of degrees, correcting slightly
late — and never name a device. "Shot on iPhone" in a video prompt tends to put a phone in frame.

## 8. The anatomy quietly fails

Elongated forearms, an elbow bending the wrong way, a hand with an extra knuckle. Most visible
when the product is held out toward the lens.

**Fix.** Keep the product at chest height rather than pushed toward the camera — extreme
foreshortening is where hands break. If a run comes back with a bad hand, rerun with the gesture
lowered rather than rewriting the whole prompt.

## The order to debug in

When a clip is wrong, change **one** thing and rerun. In this order, because this is the order of
how often it is the cause:

1. The gesture — make it smaller.
2. The light — make it neutral and side-on.
3. The line — make it longer and name the stress.
4. The material sentence — add it, or make it specific.
5. The staging — move the product down and keep one face of it to the lens.

Changing several at once produces a better clip and no knowledge. The point of the loop is that
the next brief starts closer.
