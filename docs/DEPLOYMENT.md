# Deployment Notes

These notes describe where deployment truth currently lives. They intentionally do not include secret values, private deployment URLs, API keys, bearer tokens, or raw ArcGIS service URLs.

## ChatKit App Deployment

The `zoner` app is configured as a Next.js app with Replit-compatible scripts:

- `npm run dev`: starts the development server on host `0.0.0.0`, port `5000`.
- `npm run build`: builds the Next.js app.
- `npm run start`: starts the built app on host `0.0.0.0`, port `5000`.

Required environment variables:

- `OPENAI_API_KEY`: server-side only. Used by `/api/create-session` to create ChatKit sessions.
- `NEXT_PUBLIC_CHATKIT_WORKFLOW_ID`: the Agent Builder workflow ID for this deployment environment.

Optional environment variables:

- `CHATKIT_API_BASE`: override for the ChatKit API base URL. Leave unset for the standard OpenAI API.

## MCP Server Deployment

The GIS MCP server lives in `melbamorph/zonerMCP` and is deployed separately.

The deployed MCP service must expose:

- `POST /mcp`: MCP tool endpoint used by Agent Builder.
- `GET /health`: health check endpoint for deployment monitoring.

Important MCP configuration values should live in the deployment environment or secret store, not in GitHub:

- `ARCGIS_BASE_URL`
- `REQUIRE_AUTH`
- `MCP_BEARER_TOKEN`
- `CORS_ALLOW_ORIGINS`
- Rate limit and cache settings, if changed from defaults.

If bearer auth is enabled, the matching token must be configured in the Agent Builder MCP tool setup. Do not commit it.

## Agent Builder

Agent Builder remains the source of truth for:

- The active workflow graph.
- Guardrails and routing.
- File search and vector store configuration.
- MCP tool registration.
- Response behavior and citation instructions.
- Trace review and evals.

Do not infer the live Agent Builder setup from GitHub alone. Before making claims about production behavior, inspect the workflow in Agent Builder.

## Replit

Replit is currently used for hosting or deployment of some parts of the experience. Treat Replit project settings and secrets as deployment configuration, not source code.

Document secret names in GitHub when useful, but never document secret values.

## Pre-PR Checks

For `zoner` changes:

```bash
npm ci
npm run lint
npm run build
```

For `zonerMCP` changes:

```bash
npm ci
npm run lint --if-present
npm test --if-present
```

For `3DMcD/ZoningOrdinance` changes, test in that repository:

```bash
bundle exec jekyll build
```
