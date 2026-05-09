# Zoner Project Map

Zoner is a small system made of several pieces. Each piece should stay focused on its own job so the project remains understandable for technical maintainers and nontechnical municipal staff.

## 1. ChatKit App: `melbamorph/zoner`

This repository owns the user-facing chatbot experience.

- Framework: Next.js with React and ChatKit.
- Main responsibility: show the chat UI and create ChatKit sessions server-side.
- Important secret boundary: `OPENAI_API_KEY` must stay server-side.
- Workflow connection: `NEXT_PUBLIC_CHATKIT_WORKFLOW_ID` points the app to the active Agent Builder workflow for the current environment.
- Current GIS note: the app also has a direct `/api/lookup_zoning_district` route that queries ArcGIS-style data by latitude and longitude. Keep it for now, but decide later whether it is legacy, a fallback, or a UI-only helper now that `zonerMCP` exists.

## 2. Agent Builder

Agent Builder is the source of truth for agent behavior.

Keep these decisions in Agent Builder, not duplicated as code in this repository:

- Guardrails and safety instructions.
- Query routing and clarification behavior.
- File search and vector store configuration.
- MCP tool registration and tool-call behavior.
- Response style, citation expectations, and refusal behavior.
- Trace review and evals.

GitHub can document the intended shape of the workflow, but maintainers must verify the live configuration in Agent Builder before making behavior claims.

## 3. GIS MCP Server: `melbamorph/zonerMCP`

The MCP server owns Lebanon zoning and GIS lookup tools for agents.

- Runtime: Node and Express.
- MCP endpoint: public `POST /mcp` for tool calls.
- Health endpoint: `GET /health`.
- Main capabilities: list layers, describe layers, query allowed GIS layers, and look up zoning by address.
- Safety controls: layer allowlist, field policies, record limits, optional bearer authentication, rate limiting, caching, and CORS configuration.
- Data sensitivity: GIS and property-related results may be public data, but they can still include address or parcel context. Use them responsibly and avoid presenting them as final zoning determinations.

The MCP server should own ArcGIS integration details, layer policy, auth/rate limits, and data-source configuration.

## 4. Ordinance Site: `3DMcD/ZoningOrdinance`

The ordinance repository owns the beta web-readable ordinance site.

- Framework: Jekyll with GitHub Pages.
- Content location: ordinance article pages in `_pages/`.
- Source tracking: official source PDFs and metadata in `_source_pdfs/`.
- Presentation logic: shared includes and custom rendering for legal outlines, tables, navigation, and search.
- Future Zoner use: stable ordinance links and structured citation targets.

The site is a presentation layer only. The official City PDF remains the legal source of truth.

## Recommended Boundaries

- Keep `zoner` focused on UI, session creation, user-facing copy, and links to project documentation.
- Keep `zonerMCP` focused on GIS tools, layer policy, ArcGIS access, and MCP transport.
- Keep `ZoningOrdinance` focused on ordinance content, source tracking, structured rendering, and stable citation anchors.
- Keep Agent Builder focused on the agent's actual reasoning workflow, safety rules, tool usage, and evals.

## Open Architecture Questions

- Decide whether the direct ArcGIS route in `zoner` should remain, move behind `zonerMCP`, or be removed after the MCP workflow is fully verified.
- Decide how citation links should map from Agent Builder responses to stable anchors in the Jekyll ordinance site.
- Decide what minimal public feedback loop, if any, should exist for users who find a confusing or incorrect answer.
