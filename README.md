# rendrr Agent Skills

Public [Agent Skills](https://code.claude.com/docs/en/skills) for **[rendrr.ai](https://rendrr.ai)** — a
generative media studio for images, video and audio.

The skills teach an AI agent how to drive rendrr through rendrr's hosted MCP server
(`https://mcp.rendrr.ai/mcp`): which tool to call, how to pick a model from the account's own live
catalog, how to write prompts that hold up, and what to do when a generation comes back wrong.

## Install

```bash
npx skills add rendrr-ai/skills
```

Already installed? `npx skills update` refreshes the skills you have; re-run the `add` command
above to also pick up newly added skills.

Day-to-day improvements (models, prompt recipes, pricing) ship server-side and reach every
installed skill instantly — updating is only needed when the skill files themselves change.

Then connect rendrr itself:

- **claude.ai / Claude Desktop** — Settings → Connectors → *Add custom connector* → URL
  `https://mcp.rendrr.ai/mcp`. Sign in with Google. No API key.
- **Claude Code** — `claude mcp add --transport http rendrr https://mcp.rendrr.ai/mcp`

MCP access is included from the **Expert** plan upward. Generations are charged to the signed-in
user's own rendrr credits.

## Skills

| Skill | What it does |
|---|---|
| **rendrr-generate** | Generate and edit images, video and audio. Picks the model from the live catalog, optionally sharpens the prompt first, delivers the media URL. |
| **rendrr-characters** | Reuse an existing rendrr character (AI influencer, recurring persona) across new generations so the face and identity stay recognisable. |
| **rendrr-product-shots** | Build commercial imagery around a real product — packshots, in-context scenes, banners, ad visuals — with the label, logo and pack text kept faithful to the reference. |
| **rendrr-ugc-ads** | Make a UGC-style ad clip: a character holds, wears, opens or reviews a real product and speaks one line to the lens. Seven shapes (talking head, unboxing, how-to, review, try-on, showcase, problem/fix). |
| **rendrr-ad-multiplier** | Turn one existing ad clip into several versions with one named thing changed per version — the person, the product, the outfit, the background or one added effect. |

Each skill is a thin router: the `SKILL.md` holds the workflow, and the deeper material
(prompt craft, identity consistency, error recovery) lives in `references/` and is read only when
it is actually needed. Every `SKILL.md` carries a `version:` in its frontmatter; it changes whenever
the file itself changes.

## Design notes

- **Nothing about the catalog is baked in.** The skills never hardcode model names, prices or
  capabilities — they call `gateway_models` at the start of a task and choose from whatever the
  account can actually reach. rendrr's line-up changes server-side; the skills keep working.
- **Customer tools only.** The skills use the customer tool surface: model discovery, the credit
  balance and a price-only `dryRun`, prompt enhancement, generation, and the user's own library,
  characters, presets and templates. The
  product-shot and UGC skills can also save a result as a named library element and prepare a post —
  `post_draft` only queues it for human approval and never publishes by itself.

## Licence

MIT.

## Contact

Questions or issues: info@robinwessels.com
