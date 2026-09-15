# Variant axes

Which axis to vary, in what order, and which combinations waste money.

## The rule

**One axis per variant.** Not a style preference — an arithmetic one. If variant 2 changes both the
presenter and the background and it beats variant 1, you have learned nothing you can reuse. The
whole reason to multiply an ad is to end up knowing *which* change moved the number.

Two axes at once is worth it in exactly one case: the user is not testing, they just want more
finished creatives from one shoot. Say out loud that you are doing that, so nobody later reads the
results as a test.

## The axes, in the order worth testing

| # | Axis | Why it is here | Typical lift |
|---|---|---|---|
| 1 | **The presenter** | who says it outranks what is said; a face that matches the audience is the single biggest swing | large |
| 2 | **The product on screen** | the same ad carrying a different SKU is a whole new campaign for one edit | large, and it is free reach across a catalogue |
| 3 | **The setting** | moves the perceived price and the perceived audience at once | medium |
| 4 | **The outfit** | cheap, and it changes who the presenter reads as | medium |
| 5 | **One added event** | a splash, steam, a light change — buys attention in the first second | medium, decays fast |
| 6 | **Camera standpoint** | the same take as a different shot; makes one recording look like a multi-camera shoot | medium |
| 7 | **An attribute** | colour, material, finish | small, but nearly free |

## Combinations to avoid

- **Presenter + outfit.** The person reference already carries the clothing. Changing both means
  you cannot tell which one the viewer reacted to, and the two instructions fight inside the prompt.
- **Setting + lighting.** A new location brings its own light. Naming a separate lighting change on
  top produces an implausible composite.
- **Product + attribute of that product.** Replace it or recolour it, not both.
- **Anything + duration.** Never let a variant have a different length. Length is a confound that
  shows up in every metric you would want to read.

## Building the list

For a catalogue, zip rather than multiply. Five products across three presenters is **not** fifteen
variants — that is a Cartesian product and it costs fifteen runs to learn two things. Run five
product variants on one presenter, find the winner, then run three presenter variants on that
winner. Eight runs, both answers.

Keep the ordering stable from planning through delivery: variant 3 in the plan is variant 3 in the
prompt, in the run, and in what you hand back. Renumbering mid-flight is how a client ends up
testing a creative they never approved.

## The one-shot-to-many-angles case

A special use of axis 6, from [@nomadatoast](https://www.instagram.com/reel/DclvqfjpoXc/)
(published 26 Aug 2026, read 4 Sep 2026; workflow described at **00:14–00:32**, result visible at
**00:30**): one talking-head recording becomes eight camera setups — wide, hands close-up,
three-quarter, tight face.

It works because the performance and audio stay identical, so the cuts are free to be intercut
later as if they were filmed simultaneously. The step that makes it affordable is the still: he
takes one frame, upgrades it in an image model until the set and lighting are right, approves that,
and only then pays for the video run. Copy that order.

For rendrr this means: **stills are the draft medium for video edits.** Any change you can judge on
a frame should be judged on a frame first.

## When not to multiply at all

- The source is under 4 seconds — there is nothing to preserve, generate fresh instead.
- The source is a montage of unrelated cuts — edit models hold one scene, not a sequence.
- The ad is not working yet. Multiplying a creative that has not proven itself just buys more of
  the same result. Find one that works, then multiply that.
