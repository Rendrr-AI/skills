---
version: 2.0.0
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

This skill is a router. The playbook itself lives on rendrr's server, so every agent always gets
the current version without a skill update.

## Step 1 — Load the playbook

Call the rendrr MCP tool `workflow_get` with `{ "key": "ugc-ads" }` and follow the body it returns,
step by step. When a step points to a reference file, load it with
`{ "key": "ugc-ads", "file": "references/<name>.md" }`. `workflows` lists every playbook.

With the rendrr CLI instead of MCP: `rendrr workflows get ugc-ads` prints the same playbook
(`--file references/<name>.md` for a reference).

## Step 0 — Not connected yet

If `workflow_get` is not among your tools and there is no CLI, stop and give the user the connect
step:

- **claude.ai / Claude Desktop** — Settings → Connectors → *Add custom connector*, URL
  `https://mcp.rendrr.ai/mcp`. Sign-in is Google; there is no API key to paste.
- **Claude Code** — `claude mcp add --transport http rendrr https://mcp.rendrr.ai/mcp`

MCP access is included **from the Expert plan** (Expert or custom). Then start again at Step 1.
