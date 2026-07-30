# rendrr Agent Skills

Public [Agent Skills](https://code.claude.com/docs/en/skills) for **[rendrr.ai](https://rendrr.ai)** — a
generative media studio for images, video and audio.

The skills teach an AI agent how to drive rendrr through rendrr's hosted MCP server
(`https://mcp.rendrr.ai/mcp`): which tool to call, how to pick a model from the account's own live
catalog, how to write prompts that hold up, and what to do when a generation comes back wrong.

## Install

```bash
# NOTE: repository path is finalised at publish time — check the repo URL before running this.
npx skills add robinwessels/rendrr-skills
```

Then connect rendrr itself:

- **claude.ai / Claude Desktop** — Settings → Connectors → *Add custom connector* → URL
  `https://mcp.rendrr.ai/mcp`. Sign in with Google. No API key.
- **Claude Code** — `claude mcp add --transport http rendrr https://mcp.rendrr.ai/mcp`

MCP access is included from the **Pro** plan upward. Generations are charged to the signed-in user's
own rendrr credits.

## Skills

| Skill | What it does |
|---|---|
| **rendrr-generate** | Generate and edit images, video and audio. Picks the model from the live catalog, optionally sharpens the prompt first, delivers the media URL. |
| **rendrr-characters** | Reuse an existing rendrr character (AI influencer, recurring persona) across new generations so the face and identity stay recognisable. |

Each skill is a thin router: the `SKILL.md` holds the workflow, and the deeper material
(prompt craft, identity consistency, error recovery) lives in `references/` and is read only when
it is actually needed.

## Design notes

- **Nothing about the catalog is baked in.** The skills never hardcode model names, prices or
  capabilities — they call `genai_gateway_models` at the start of a task and choose from whatever the
  account can actually reach. rendrr's line-up changes server-side; the skills keep working.
- **Read-only by default.** The skills use only the customer tool surface: model discovery, prompt
  enhancement, generation, and read-only listing of the user's own library, characters, presets and
  templates.

## Licence

MIT.

## Contact

Questions or issues: info@robinwessels.com
