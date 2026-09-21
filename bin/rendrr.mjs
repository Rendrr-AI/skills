#!/usr/bin/env node
// rendrr CLI — owner-first (Sprint 2, 15 sep '26). One file, no dependencies, Node 18+.
//
// Why a CLI next to MCP: in Claude Code a Bash call is cheaper than loading MCP schemas, local files and
// batches are easier, and the skills get thinner. It speaks the SAME MCP tools the Claude / ChatGPT
// connector uses (JSON-RPC over HTTP), so every price, guard and recipe is identical — plus two plain
// HTTP calls MCP has no tool for: uploading a local file (/api/upload) and polling a queued job
// (/api/fal/poll).
//
// Auth today: RENDRR_TOKEN = the owner key (the MCP key door + x-api-token). Customer tokens (a
// `rendrr login` that mints one through the OAuth door) arrive in sprint 5.
//   RENDRR_TOKEN   required
//   RENDRR_HOST    optional, default https://api.rendrr.ai (the machine host, not behind Access)
import fs from 'node:fs';
import path from 'node:path';

const HOST = String(process.env.RENDRR_HOST || 'https://api.rendrr.ai').replace(/\/+$/, '');
const TOKEN = String(process.env.RENDRR_TOKEN || '').trim();

const HELP = `rendrr — the rendrr studio from your terminal

Usage: rendrr <command> [args] [--json] [--dry-run]

  generate --model <id> --prompt "<text>" [--image <file|url>]... [--input '<json>']
  generate --template <ugc|pov|kv:<id>> [--mode <m>] [--slot key=value]... [--field key=value]...
           [--choice _type=<index>] [--param key=value]...
  enhance "<prompt>" [--kind image|video|audio|director|character|scene] [--recipe <key>]
  library ls [--kind image|video|audio] [--tag <tag>]
  library save <url> --name "<name>" [--tag a,b] [--desc "<text>"]
  library upload <file> [--name "<name>"] [--tag a,b]
  characters
  presets [<id>]                 the template catalogue, or one template in full
  apps                           the one-click apps
  apps run <id> <file|url|library name> [--ratio 16:9] [--prompt "<text>"]
  virality <file|url> [--platform TikTok|Reels|Shorts]
  flows ls | flows get <id>
  flows run <id> [--in key=value]... [--wait] [--timeout <seconds>]
                                 run a saved flow once on the server; everything lands in your Library
                                 value = text, an https url, a library id, ["id","id"] or @file to upload a local file
  flows status <run_id> [--wait] [--timeout <seconds>]
  credits
  jobs wait <statusUrl> <responseUrl> [--timeout <seconds>]

  --dry-run   price only: prints the credits the run would cost, runs nothing
  --json      print the raw JSON reply

Env: RENDRR_TOKEN (required), RENDRR_HOST (default https://api.rendrr.ai)`;

// ── args ─────────────────────────────────────────────────────────────────────────────────────────
// Flags that are switches: they never take the next word as their value (otherwise
// `apps run upscale --dry-run photo.png` would swallow the file).
const BOOL_FLAGS = new Set(['json', 'dryRun', 'help', 'wait']);
function parseArgs(argv) {
  const pos = [], flags = {}, multi = { image: [], slot: [], field: [], choice: [], param: [], tag: [], in: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const eq = a.indexOf('=');
      let key = (eq === -1 ? a.slice(2) : a.slice(2, eq)).replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      let val = eq === -1 ? undefined : a.slice(eq + 1);
      if (val === undefined) {
        const nx = argv[i + 1];
        if (!BOOL_FLAGS.has(key) && nx !== undefined && !nx.startsWith('--')) { val = nx; i++; } else val = true;
      }
      if (multi[key]) multi[key].push(String(val)); else flags[key] = val;
    } else pos.push(a);
  }
  return { pos, flags, multi };
}
function kv(list) {
  const out = {};
  for (const s of list || []) { const i = s.indexOf('='); if (i > 0) out[s.slice(0, i).trim()] = s.slice(i + 1); }
  return out;
}
function die(msg, code) { process.stderr.write('rendrr: ' + msg + '\n'); process.exit(code == null ? 1 : code); }

// ── transport ────────────────────────────────────────────────────────────────────────────────────
let rpcId = 0;
async function tool(name, args) {
  if (!TOKEN) die('set RENDRR_TOKEN first (the owner key). Customer tokens arrive in sprint 5.');
  const r = await fetch(HOST + '/api/mcp/' + encodeURIComponent(TOKEN), {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: ++rpcId, method: 'tools/call', params: { name, arguments: args || {} } }),
  });
  if (r.status === 404) die('the token was not accepted (404 on the key door). Check RENDRR_TOKEN and RENDRR_HOST.');
  const j = await r.json().catch(() => null);
  if (!j) die('unreadable reply from ' + HOST + ' (HTTP ' + r.status + ')');
  if (j.error) die((j.error.message || 'MCP error') + (j.error.code ? ' (' + j.error.code + ')' : ''));
  const txt = ((j.result && j.result.content) || []).filter((c) => c && c.type === 'text').map((c) => c.text).join('');
  let data; try { data = JSON.parse(txt); } catch (e) { data = txt; }
  return data;
}
async function http(pathname, init) {
  if (!TOKEN) die('set RENDRR_TOKEN first.');
  const headers = Object.assign({ 'x-api-token': TOKEN }, (init && init.headers) || {});
  const r = await fetch(HOST + pathname, Object.assign({}, init || {}, { headers }));
  const j = await r.json().catch(() => ({ ok: false, error: 'unreadable reply (HTTP ' + r.status + ')' }));
  return j;
}
const MIME = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif', '.mp4': 'video/mp4', '.webm': 'video/webm', '.mov': 'video/quicktime', '.mp3': 'audio/mpeg', '.wav': 'audio/wav' };
async function uploadFile(file) {
  const ext = path.extname(file).toLowerCase();
  const type = MIME[ext];
  if (!type) die('unsupported file type: ' + ext + ' (png, jpg, webp, gif, mp4, webm, mov, mp3, wav)');
  const buf = fs.readFileSync(file);
  const j = await http('/api/upload?name=' + encodeURIComponent(path.basename(file)), { method: 'POST', headers: { 'content-type': type }, body: buf });
  if (!j || !j.ok || !j.url) die('upload failed: ' + ((j && j.error) || '?'));
  return j.url;
}
// A local path is uploaded first; anything else (https url, /r2/ url, library name) goes as-is.
async function asRef(v) {
  const s = String(v || '');
  if (s && fs.existsSync(s) && fs.statSync(s).isFile()) return uploadFile(s);
  return s;
}
function abs(u) { const s = String(u || ''); return s.startsWith('/') ? HOST.replace('://api.', '://app.') + s : s; }

// ── output ───────────────────────────────────────────────────────────────────────────────────────
let AS_JSON = false;
function out(data, human) {
  if (AS_JSON || typeof human !== 'function') { process.stdout.write(JSON.stringify(data, null, 2) + '\n'); return; }
  human(data);
}
function failIf(data) {
  if (data && typeof data === 'object' && data.ok === false) {
    if (AS_JSON) process.stdout.write(JSON.stringify(data, null, 2) + '\n');
    die((data.error || 'failed') + (data.code ? ' [' + data.code + ']' : ''), 1);
  }
}
function printMedia(d) {
  if (d && d.dryRun) { console.log('dry run: ' + (d.model ? d.model + ' · ' : '') + '✦ ' + d.credits); return; }
  if (d && d.pending) { console.log('still running — ' + (d.note || '')); console.log('rendrr jobs wait "' + d.statusUrl + '" "' + d.responseUrl + '"'); return; }
  for (const m of (d && d.media) || []) console.log(abs(m.url) + (m.kind ? '  (' + m.kind + ')' : ''));
  for (const t of (d && d.texts) || []) console.log(t);
  const bits = [];
  if (d && d.model) bits.push(d.model);
  if (d && d.credits != null) bits.push('✦ ' + d.credits);
  if (d && d.switched) bits.push('switched ' + d.switched.from + ' → ' + d.switched.to);
  if (bits.length) console.log(bits.join(' · '));
  if (d && d.note) console.log(d.note);
}

// ── commands ─────────────────────────────────────────────────────────────────────────────────────
async function main() {
  const { pos, flags, multi } = parseArgs(process.argv.slice(2));
  AS_JSON = !!flags.json;
  const dry = !!flags.dryRun;
  const cmd = pos[0], sub = pos[1];
  if (!cmd || cmd === 'help' || flags.help) { console.log(HELP); return; }

  if (cmd === 'generate') {
    const args = {};
    if (dry) args.dryRun = true;
    if (flags.template) {
      const slots = kv(multi.slot);
      for (const k of Object.keys(slots)) slots[k] = await asRef(slots[k]);
      const choices = {}; for (const [k, v] of Object.entries(kv(multi.choice))) choices[k] = Number(v);
      const params = {}; for (const [k, v] of Object.entries(kv(multi.param))) params[k] = /^\d+$/.test(v) ? Number(v) : (v === 'false' ? false : v === 'true' ? true : v);
      args.template = { id: String(flags.template), slots, fields: kv(multi.field), choices, params };
      if (flags.mode) args.template.mode = String(flags.mode);
      if (flags.model) args.template.model = String(flags.model);
    } else {
      if (!flags.model) die('generate needs --model <id> (see gateway models) or --template <id> (see rendrr presets)');
      args.model = String(flags.model);
      if (flags.prompt) args.prompt = String(flags.prompt);
      const input = flags.input ? JSON.parse(String(flags.input)) : {};
      const imgs = [];
      for (const im of multi.image) imgs.push(await asRef(im));
      if (imgs.length === 1 && !input.image_urls) input.image_url = imgs[0];
      if (imgs.length > 1) input.image_urls = imgs;
      if (Object.keys(input).length) args.input = input;
    }
    const d = await tool('generate', args); failIf(d); out(d, printMedia); return;
  }
  if (cmd === 'enhance') {
    const prompt = pos.slice(1).join(' ') || flags.prompt;
    if (!prompt) die('enhance needs a prompt');
    const d = await tool('enhance', { prompt: String(prompt), kind: flags.kind ? String(flags.kind) : undefined, recipe: flags.recipe ? String(flags.recipe) : undefined });
    failIf(d); out(d, (x) => console.log(x.prompt || x.enhanced || x.text || JSON.stringify(x, null, 2))); return;
  }
  if (cmd === 'library') {
    if (!sub || sub === 'ls') {
      let items = await tool('library', {}); failIf(items);
      items = Array.isArray(items) ? items : [];
      if (flags.kind) items = items.filter((i) => i.kind === flags.kind);
      // --tag is collected as a list (it may repeat); every given tag must be on the item.
      const want = [].concat(...multi.tag.map((t) => t.split(','))).map((t) => t.trim()).filter(Boolean);
      if (want.length) items = items.filter((i) => want.every((t) => (i.tags || []).indexOf(t) !== -1));
      out(items, (xs) => { for (const i of xs) console.log([i.id, i.kind, i.name || '', abs(i.url), (i.tags || []).join(',')].join('\t')); console.log(xs.length + ' item(s)'); });
      return;
    }
    if (sub === 'save' || sub === 'upload') {
      const src = pos[2]; if (!src) die('library ' + sub + ' needs a ' + (sub === 'upload' ? 'file' : 'url'));
      const url = sub === 'upload' ? await uploadFile(src) : await asRef(src);
      const name = String(flags.name || path.basename(src).replace(/\.[a-z0-9]+$/i, '')).slice(0, 60);
      const tags = [].concat(...multi.tag.map((t) => t.split(','))).map((t) => t.trim()).filter(Boolean);
      const kind = /\.(mp4|webm|mov)(\?|$)/i.test(url) ? 'video' : (/\.(mp3|wav)(\?|$)/i.test(url) ? undefined : 'image');
      const d = await tool('library_save', { url, name, kind, tags: tags.length ? tags : undefined, desc: flags.desc ? String(flags.desc) : undefined });
      failIf(d); out(d, (x) => console.log('saved: ' + name + (x && x.item && x.item.id ? '  (' + x.item.id + ')' : ''))); return;
    }
    die('library: ls | save | upload');
  }
  if (cmd === 'characters') {
    const cs = await tool('list_characters', {}); failIf(cs);
    out(cs, (xs) => { for (const c of xs || []) console.log([c.id, c.name, c.sheet ? 'sheet' : (c.image ? 'portrait' : '—'), c.identity ? String(c.identity).slice(0, 80) : ''].join('\t')); });
    return;
  }
  if (cmd === 'presets') {
    const d = await tool('template_get', sub ? { id: sub } : {}); failIf(d);
    out(d, (x) => {
      if (!sub) {
        console.log('Presets:'); for (const p of x.presets || []) console.log('  ' + p.id + '\t' + p.name + ' (' + p.tab + ')');
        console.log('Templates:'); for (const t of x.templates || []) console.log('  ' + t.id + '\t' + t.name + (t.set ? ' · set' : ''));
        console.log('Apps:'); for (const a of x.apps || []) console.log('  ' + a.id + '\t' + a.name);
        return;
      }
      console.log(JSON.stringify(x, null, 2));
    });
    return;
  }
  if (cmd === 'apps') {
    if (!sub || sub === 'ls') { const d = await tool('template_get', {}); failIf(d); out(d.apps || [], (xs) => { for (const a of xs) console.log(a.id.replace(/^app:/, '') + '\t' + a.name + ' (' + a.input + ')'); }); return; }
    if (sub === 'run') {
      const id = pos[2], src = pos[3];
      if (!id || !src) die('apps run <id> <file|url|library name>');
      const ref = await asRef(src);
      const t = { id: 'app:' + id, slots: { source: ref }, params: {}, fields: {} };
      if (flags.ratio) t.params.aspect_ratio = String(flags.ratio);
      if (flags.prompt) t.fields.prompt = String(flags.prompt);
      const d = await tool('generate', { template: t, dryRun: dry || undefined }); failIf(d); out(d, printMedia); return;
    }
    die('apps: ls | run');
  }
  if (cmd === 'virality') {
    const src = pos[1]; if (!src) die('virality <file|url>');
    const url = await asRef(src);
    const d = await tool('virality', { video_url: url, platform: flags.platform ? String(flags.platform) : undefined }); failIf(d);
    out(d, (x) => {
      const r = x.result || {};
      console.log('score ' + (r.score == null ? '—' : r.score) + '/100 — ' + (r.verdict || ''));
      console.log('hook lands at ' + (r.hook_second == null ? '—' : r.hook_second + ' s') + ' · still watching at the end ≈ ' + (r.hold_estimate == null ? '—' : r.hold_estimate + '%'));
      if ((r.why || []).length) { console.log('why:'); for (const w of r.why) console.log('  - ' + w); }
      if ((r.fix || []).length) { console.log('fix:'); for (const f of r.fix) console.log('  - ' + f); }
      if (x.credits != null) console.log('✦ ' + x.credits);
    });
    return;
  }
  if (cmd === 'flows') {
    if (!sub || sub === 'ls') { const d = await tool('flows', {}); failIf(d); out(d, (xs) => { for (const f of (Array.isArray(xs) ? xs : (xs.flows || []))) console.log([f.id, f.name, (f.nodes || f.nodeCount || '') + ' nodes'].join('\t')); }); return; }
    if (sub === 'get') { if (!pos[2]) die('flows get <id>'); const d = await tool('flow_get', { id: pos[2] }); failIf(d); out(d); return; }
    // Flow-as-API (A6, 21 sep '26): flow_run start één run op de server, flow_status leest hem (wacht max 45 s per call).
    if (sub === 'run' || sub === 'status') {
      let runId = pos[2];
      if (!runId) die(sub === 'run' ? 'flows run <flow id> [--in key=value]...' : 'flows status <run_id>');
      if (sub === 'run') {
        // Geen dry run (review 4c): een stille echte run op --dry-run is een betaalde run die niemand vroeg.
        if (flags.dryRun) die('flows run has no dry run yet: the price per node shows on the canvas (Flows, Run flow).', 2);
        const inputs = {};
        for (const kv of (multi.in || [])) {
          const i = String(kv).indexOf('=');
          if (i < 1) die('--in takes key=value (the key is an input key or a node id, see flows get)');
          const k = String(kv).slice(0, i), v = String(kv).slice(i + 1);
          // Een lijst ([...]) = library-ids voor een product/character/clothing/scene-node. Alleen @pad uploadt een lokaal
          // bestand (review 4c): een gewone tekst die toevallig een bestandsnaam is, ging anders ongevraagd de Library in.
          if (v.startsWith('[')) { try { inputs[k] = JSON.parse(v); } catch (e) { die('--in ' + k + ': not valid JSON'); } }
          else if (v.startsWith('@')) { const pth = v.slice(1); if (!fs.existsSync(pth)) die('--in ' + k + ': file not found: ' + pth); inputs[k] = await asRef(pth); }
          else inputs[k] = v;
        }
        const d = await tool('flow_run', { flow_id: runId, inputs });
        failIf(d);
        runId = d.run_id;
        if (!flags.wait) { out(d, (x) => { console.log(x.run_id + '\t' + x.status); console.log('rendrr flows status ' + x.run_id + ' --wait'); }); return; }
      }
      const limit = Date.now() + (Number(flags.timeout) || (flags.wait ? 900 : 30)) * 1000;
      for (;;) {
        const left = Math.max(0, Math.min(45, Math.round((limit - Date.now()) / 1000)));
        const d = await tool('flow_status', { run_id: runId, timeout: flags.wait ? left : 0 });
        if (d && d.ok === false && d.code) failIf(d);
        if (d.done || !flags.wait || Date.now() >= limit) {
          out(d, (x) => {
            console.log(x.run_id + '\t' + x.status + (x.credits != null ? '\t✦ ' + x.credits : ''));
            for (const o of (x.outputs || [])) console.log(o.kind === 'text' ? ('[' + (o.label || o.node_id) + '] ' + o.text) : (abs(o.url) + '  (' + o.kind + (o.library_id ? ', library ' + o.library_id : '') + (o.output ? ', output' : '') + ')'));
            if (x.error) console.log('error: ' + x.error);
            if (!x.done) console.log('still running: rendrr flows status ' + x.run_id + ' --wait');
          });
          if (d.status === 'failed') process.exit(1);
          return;
        }
        if (!AS_JSON) process.stderr.write('.');
      }
    }
    die('flows: ls | get | run | status');
  }
  if (cmd === 'credits') {
    const d = await tool('credits', {}); failIf(d);
    out(d, (x) => { if (!x.enabled) { console.log('credits are not metered on this account' + (x.plan ? ' (plan ' + x.plan + ')' : '')); return; } console.log('✦ ' + x.balance + ' (plan ' + (x.planCredits || 0) + ' + top-up ' + (x.topupCredits || 0) + ')' + (x.plan ? ' · ' + x.plan : '') + (x.exempt ? ' · exempt' : '')); });
    return;
  }
  if (cmd === 'jobs' && sub === 'wait') {
    const su = pos[2], ru = pos[3];
    if (!su || !ru) die('jobs wait <statusUrl> <responseUrl>');
    const limit = Date.now() + (Number(flags.timeout) || 600) * 1000;
    for (;;) {
      const j = await http('/api/fal/poll', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ statusUrl: su, responseUrl: ru }) });
      failIf(j);
      // Some refusals (e.g. an invalid poll URL) carry only { error } — stop instead of waiting out the timeout.
      if (j && j.error && !j.done) die(String(j.error), 1);
      if (j.done) { out(j, printMedia); return; }
      if (Date.now() > limit) die('timed out — still ' + (j.status || 'running'), 3);
      if (!AS_JSON) process.stderr.write('.');
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
  die('unknown command: ' + cmd + '\n\n' + HELP);
}
main().catch((e) => die((e && e.message) || String(e)));
