import { createV2Client } from "confluence.js";

/**
 * Confluence Cloud v2 API client, configured but not yet called anywhere in
 * this codebase. Wire pages/components up to this once business logic is
 * implemented — it is intentionally left disconnected for now.
 *
 * Requires CONFLUENCE_HOST / CONFLUENCE_EMAIL / CONFLUENCE_API_TOKEN to be
 * set in the environment before use.
 */
export const confluenceClient = createV2Client({
  host: process.env.CONFLUENCE_HOST ?? "https://your-domain.atlassian.net",
  auth: {
    type: "basic",
    email: process.env.CONFLUENCE_EMAIL ?? "",
    apiToken: process.env.CONFLUENCE_API_TOKEN ?? "",
  },
});
