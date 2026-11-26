# T3 Code and Grok Bot: MCP connection findings

Research checked: 2026-11-26. This note answers whether T3 Code exposes an MCP server and whether Grok Bot can use it.

## Findings

- **T3 Code does expose an MCP server.** Its official `outside-agents` guide describes connecting external agents to a T3 Code environment over MCP, with an environment endpoint ending in `/mcp`. The guide says it can expose project/thread reading, thread launch and messaging, and event monitoring, subject to granted access. [T3 Code: Outside agents](https://github.com/pingdotgg/t3code/blob/main/docs/user/outside-agents.md)
- **Grok Bot can use custom MCP servers.** xAI's Grok Bot docs say a Bot can add a non-catalog MCP server by URL or by a command running on its computer. xAI also documents custom connectors, which require a publicly reachable server URL. [Grok Bot: Use the computer and apps](https://docs.x.ai/grok-bot/computer-and-apps), [Grok connectors](https://docs.x.ai/grok/connectors)
- **Therefore, connecting Grok Bot to T3 Code should be supported through T3 Code's remote MCP URL**, assuming the user's T3 environment is reachable to Grok Bot and the Grok Bot team policy allows the server. This conclusion follows from the two product docs; it is not a claim that the integration has already been configured on this account.
- **Connection setup in T3 Code:** use the command palette action **Use T3 Code in another app (MCP)** (or Sharing & access), select the external app, and follow the authorization flow. For cloud assistants, T3 Connect must be enabled. Copy the environment's MCP URL from Settings → Environments. T3 docs state OAuth needs HTTPS or localhost; a plain HTTP LAN/Tailscale address will not complete OAuth. [T3 Code: Outside agents](https://github.com/pingdotgg/t3code/blob/main/docs/user/outside-agents.md)
- **Connection setup in Grok Bot:** add a custom MCP server/connector with that URL and complete its authentication flow. Grok Bot's hosted environment must be able to reach the endpoint; if network controls block it, the server's host must be allowed by the team's Grok Bot network policy. [Grok Bot: Use the computer and apps](https://docs.x.ai/grok-bot/computer-and-apps), [Grok Bot security](https://docs.x.ai/grok-bot/security)
- **This is separate from running Grok inside T3 Code.** T3 Code lists Grok as a built-in provider, and its provider guide covers signing Grok in under Settings → Providers. That lets a T3 thread run Grok; it does not itself connect the separate Grok Bot service. [T3 Code: ACP providers](https://github.com/pingdotgg/t3code/blob/main/docs/user/providers-acp.md)

## Practical access boundary

The official T3 guide presents permission levels from read-only to supervised/full access. Start with read-only if Grok Bot only needs to inspect project/thread state; grant thread launch/message permissions only if needed. The endpoint provides capabilities in the T3 environment, so the selected permission level and network reachability should be checked before relying on it for unattended work. [T3 Code: Outside agents](https://github.com/pingdotgg/t3code/blob/main/docs/user/outside-agents.md)

## Recommendation for this project

For prayer-time collection, the simpler existing route remains Grok Bot's GitHub integration opening a data PR, with this repository's source-verification and human-merge rules. T3 MCP could let Grok Bot inspect or launch T3 project threads as an additional workflow, but it is not necessary to collect source data or submit a PR. Any resulting data edit still must follow `AGENTS.md` and `docs/branch-workflow.md`.
