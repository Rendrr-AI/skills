---
version: 2.0.0
name: rendrr-characters
description: >-
  Reuse an existing rendrr.ai character across new generations so the same face,
  build and styling stay recognisable. Use when: "use my character", "put
  <name> in this scene", "same person as last time", "keep the face consistent",
  "my AI influencer", "consistent character across images", "character sheet",
  "which characters do I have", "generate a new photo of <character>", "make a
  video with my avatar". NOT for: one-off generations with no recurring
  identity, or general image/video/audio work — use rendrr-generate for that.
---

# rendrr Characters

This skill is a router. The playbook itself lives on rendrr's server, so every agent always gets
the current version without a skill update.

## Step 1 — Load the playbook

Call the rendrr MCP tool `workflow_get` with `{ "key": "characters" }` and follow the body it returns,
step by step. When a step points to a reference file, load it with
`{ "key": "characters", "file": "references/<name>.md" }`. `workflows` lists every playbook.

With the rendrr CLI instead of MCP: `rendrr workflows get characters` prints the same playbook
(`--file references/<name>.md` for a reference).

## Step 0 — Not connected yet

If `workflow_get` is not among your tools and there is no CLI, stop and give the user the connect
step:

- **claude.ai / Claude Desktop** — Settings → Connectors → *Add custom connector*, URL
  `https://mcp.rendrr.ai/mcp`. Sign-in is Google; there is no API key to paste.
- **Claude Code** — `claude mcp add --transport http rendrr https://mcp.rendrr.ai/mcp`

MCP access is included **from the Expert plan** (Expert or custom). Then start again at Step 1.
