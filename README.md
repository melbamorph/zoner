# Zoner

Zoner is an experimental, public-facing zoning assistant for Lebanon, New Hampshire. This repository contains the ChatKit and Next.js application that hosts the chatbot experience and creates ChatKit sessions for an OpenAI Agent Builder workflow.

Zoner is not an official tool of the City of Lebanon, NH, and it does not make official zoning determinations. Answers may be incomplete, outdated, or wrong. Final zoning determinations must come from authorized City staff, and the official City zoning ordinance remains the legal source of truth.

## What This Repo Owns

- The user-facing ChatKit web app.
- Server-side ChatKit session creation with `OPENAI_API_KEY`.
- The workflow ID setting that connects the app to the Agent Builder workflow.
- User-facing copy, disclaimers, and links to supporting project documentation.
- A direct zoning district lookup API route that should be reviewed later against the separate MCP service.

For the broader system map, see [docs/PROJECT_MAP.md](docs/PROJECT_MAP.md). For deployment notes, see [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Sources Of Authority

- The official City of Lebanon zoning ordinance PDF and authorized City staff are authoritative.
- The `3DMcD/ZoningOrdinance` GitHub Pages site is a beta presentation layer for easier reading and future citation links.
- Zoner responses are assistance only. They are not legal advice, not a permit approval, and not an official zoning determination.
- GIS, address, parcel, and zoning layer results may help orient a question, but they should be checked against official sources before anyone relies on them.

## Related Project Pieces

- `melbamorph/zoner`: this ChatKit and Next.js app.
- `melbamorph/zonerMCP`: the MCP server for Lebanon zoning and GIS lookup.
- `3DMcD/ZoningOrdinance`: the beta Jekyll ordinance site.
- OpenAI Agent Builder: the source of truth for the agent workflow, including routing, guardrails, file search, MCP calls, response behavior, traces, and evals.
- Replit: current hosting/deployment environment for some parts of the experience.

These pieces should stay separate for now. They have different responsibilities and can be maintained independently without forcing the whole project into one repository.

## Local Setup

Install dependencies:

```bash
npm ci
```

Create a local environment file:

```bash
cp .env.example .env.local
```

Set the required values in `.env.local`:

- `OPENAI_API_KEY`: server-side OpenAI API key. Do not expose this in client code, commit it, or paste it into documentation.
- `NEXT_PUBLIC_CHATKIT_WORKFLOW_ID`: the Agent Builder workflow ID for the environment you are testing. This is not an API secret, but it is still environment-specific configuration.

Start the development server:

```bash
npm run dev
```

The app is configured for Replit-compatible local serving on port `5000`, so the development URL is usually `http://localhost:5000`.

## Safety Rules For Maintainers

- Do not hardcode OpenAI API keys, MCP bearer tokens, ArcGIS base URLs, Replit secrets, or other private deployment values.
- Keep OpenAI API keys server-side only.
- Do not remove or weaken the unofficial-project disclaimer.
- Do not describe Zoner as an official City service, an official zoning determination tool, or a replacement for staff review.
- When a question may affect a permit, property use, enforcement, or legal rights, direct users to verify with official sources or authorized City staff.

## Development Checks

Run the standard checks before opening a pull request:

```bash
npm run lint
npm run build
```

This repository does not own the Jekyll ordinance build. Changes to `3DMcD/ZoningOrdinance` should be tested in that repository with `bundle exec jekyll build`.

## Attribution

This project was originally bootstrapped from the OpenAI ChatKit starter template and retains the starter template license terms where applicable. See [LICENSE](LICENSE).
