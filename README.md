# Ba Zi Calculator

A Four Pillars (Ba Zi) birth chart calculator: pillars + elements, 10-year luck
cycles with the current cycle highlighted, and an AI-generated reading
(personality, career, wealth/luck, health) that overlays the current luck
cycle. Includes a reference page on the ten Day Masters.

Nothing entered is stored or logged — chart math runs client-side in the
browser, and only the derived chart values (not names or contact info) are
sent to the AI endpoint to generate the reading.

## Stack

- Next.js (App Router) + TypeScript + Tailwind
- [`lunar-javascript`](https://github.com/6tail/lunar-javascript) for the Ba Zi
  / lunar calendar / 10-year luck cycle math
- [`iztro`](https://github.com/SylarLong/iztro) as a secondary, unnamed
  enrichment signal blended into the AI prompt for extra nuance
- Google **Gemini** (free tier) for the AI reading

## Local setup

```bash
npm install
```

Create `.env.local` in the project root with a Gemini API key (free, from
[aistudio.google.com/apikey](https://aistudio.google.com/apikey) — this is
separate from any Claude/Anthropic account):

```
GEMINI_API_KEY=your-key-here
```

Free-tier Gemini keys have fairly low per-minute/per-day quotas. If you're
hitting rate limits, you can list multiple keys (e.g. from separate Google
accounts/projects) comma-separated — the app falls through to the next key
only on a quota/permission error, not on unrelated failures:

```
GEMINI_API_KEY=key-one,key-two,key-three
```

Then run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploying to Vercel

1. Push this repo to GitHub (or use the Vercel CLI directly from this folder).
2. Import the project at [vercel.com/new](https://vercel.com/new).
3. In the project's Settings → Environment Variables, add `GEMINI_API_KEY`
   with your key.
4. Deploy. No database or other config is needed — the app is fully
   stateless.

Or via CLI:

```bash
npm i -g vercel
vercel
```

(Vercel will prompt you to add `GEMINI_API_KEY` on first deploy, or add it
afterwards under the project's Environment Variables settings and redeploy.)

## Notes on accuracy

- Ba Zi math (pillars, elements, 10-year luck cycles) uses real solar-term
  data via `lunar-javascript`, so it should match traditional calculators.
- Entered civil clock time is converted to true (apparent) solar time before
  computing pillars: a longitude-vs-standard-meridian correction plus the
  equation of time for that date. This is usually a shift of tens of minutes
  — enough to occasionally flip the Hour Pillar near a 2-hour boundary, but
  it will not shift results by hours just because two birth locations sit in
  very different time zones (Ba Zi is based on local time of day, not a
  shared universal clock). DST is not accounted for.
- If birth time is unknown, the Hour Pillar is omitted and the reading is
  flagged as reduced-confidence (~72%).
