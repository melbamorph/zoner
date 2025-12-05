> **Disclaimer**: Zoner is an experimental project and does not represent an official product of the City of Lebanon. Content may change as part of ongoing research and prototyping.
# Zoner Playbook

## Introduction
Zoner is Lebanon's zoning assistant built to help citizens and planners query the city's zoning ordinance and understand allowable uses, procedures and updates. This playbook documents the architecture, data sources, workflows, prompt strategies and cost considerations for maintaining and extending Zoner.

## Architecture Overview
Zoner is built using modern agentic infrastructure:
- **Agent Builder**: OpenAI's Agent Builder provides a visual canvas for designing multi-step workflows. It allows us to assemble nodes that classify queries, fetch data and compose responses. The builder integrates with a Connector Registry to link tools and data sources.
- **ChatKit**: ChatKit is the user-facing chat interface that embeds Zoner into a website. It hosts the conversation loop and connects the agent workflow from Agent Builder to end users.
- **Model Context Protocol (MCP) Server**: Zoner uses a GIS MCP server to perform geospatial operations such as intersection, buffering and coordinate transformation. The GIS MCP server provides comprehensive geometry operations, coordinate transformations and accurate measurements. It exposes these tools via a standard protocol, enabling AI agents to call them without bespoke code.
- **GIS Data**: Zoner accesses Lebanon's official GIS datasets—including zoning boundaries, parcels, overlays and amendment layers—via the MCP server and local GIS files. Using geospatial operations from the GIS MCP server, Zoner can answer location‑based queries such as "What can I build on 123 Main Street?".
- **Web Server and Deployment**: The zoning website is hosted via GitHub Pages using the `just-the-docs` template. Zoner is embedded on relevant pages through ChatKit. The zonerMCP microservice is deployed separately to provide GIS functions.

## Data Sources
Zoner relies on the following sources:
- **Zoning articles**: The ordinance is divided into articles hosted in the zoning repository (`_pages/article-*.md`). Each article covers a chapter of the ordinance such as use districts, overlays, subdivisions and miscellaneous provisions. The agent reads these markdown files to answer regulatory questions.
- **Amendments file**: A separate `_data/amendments.yml` file lists recent amendments, effective dates and links to official documents. The agent checks this file to ensure answers reflect the latest regulations.
- **Plan file**: A project plan document `PLAN.md` outlines future development items and tasks for the zoning ordinance site. It can be used by Zoner's maintainers but is not part of the ordinance itself.
- **External references**: When necessary, Zoner may reference public resources such as the city’s zoning map, council meeting minutes and the official PDF of the zoning ordinance to verify text.

## Workflows
Zoner supports several workflows:
1. **Textual Query Workflow**
   - User submits a natural language question via ChatKit.
   - ChatKit forwards the query to the Agent Builder workflow.
   - The agent classifies the query (e.g., determine if it is about allowable uses, procedures or definitions).
   - The agent fetches relevant sections from zoning articles or amendments. For location-specific questions, it uses the GIS MCP server to lookup zoning districts for the address.
   - The agent composes a concise answer citing the ordinance section and returns it to the user through ChatKit.
2. **Geospatial Lookup Workflow**
   - User asks about a specific address or parcel.
   - Agent uses the GIS MCP server to geocode the address and intersect it with zoning layers. The GIS MCP server provides operations for intersection, union, buffers and coordinate transformations.
   - Using the identified district, the agent retrieves the corresponding article sections and summarises allowable uses and restrictions.
3. **Amendment Awareness**
   - When the ordinance text has been amended, the amendments file provides the updated text and effective dates.
   - The agent cross-checks the amendment list before returning information to ensure the answer reflects the latest modifications.
4. **Plan and Feedback Workflow**
   - Maintainers can update PLAN.md with future tasks.
   - A separate internal agent (not exposed to the public) summarises outstanding tasks and cost estimates for maintainers.

## Prompts
Zoner uses prompt templates tailored for each task:
- **Classification prompt**: Guides the agent to identify the type of question (use, procedure, definition, etc.) and select the appropriate workflow.
- **Retrieval prompt**: Structures the query to search the ordinance and amendments for relevant sections. It includes instructions to cite article numbers and amendment dates in the response.
- **Geospatial prompt**: Contains placeholders for latitude/longitude and instructs the agent to call the MCP server, interpret geospatial results and summarise applicable rules.
- **Summary prompt**: Directs the agent to produce concise, plain-language answers with citations. It emphasises clarity and encourages the agent to link to the ordinance for more information.

## Cost Considerations
Operating Zoner incurs several costs:
- **API usage**: Agent Builder and ChatKit rely on OpenAI models. Each user query consumes tokens; costs scale with query complexity and response length. To control costs, the agent should summarise relevant sections rather than sending entire articles.
- **GIS MCP server**: Running the GIS MCP server can be self-hosted. Computational costs include CPU usage for spatial operations. Complex operations like buffers and overlays may be expensive; caching results for frequently queried areas can reduce load.
- **Repository storage**: Markdown content and data files are hosted on GitHub; storage costs are negligible. However, large GIS datasets should be stored externally and accessed via the MCP server.
- **Maintenance**: Updating amendments and articles requires staff time. Automating the ingestion of ordinance updates through GitHub workflows can minimize manual work.

## Maintenance and Future Improvements
- **Data Updates**: Regularly update `_pages` and `_data` to reflect new amendments and zoning changes. Use GitHub pull requests with clear commit messages.
- **Prompt Evaluation**: Periodically evaluate prompts using evaluation tools to improve response accuracy and reduce token usage.
- **Expanded Tools**: Consider integrating other MCP servers (e.g., database or analytics) to enrich Zoner’s capabilities.
- **User Feedback**: Collect feedback from residents and planners to improve the assistant’s usability and accuracy.

## Conclusion
This playbook outlines the technical architecture, data sources, workflows, prompts and cost considerations for Lebanon's Zoner assistant. By following these guidelines, maintainers can ensure Zoner remains accurate, responsive and cost-effective while helping the public navigate the city's zoning ordinance.
