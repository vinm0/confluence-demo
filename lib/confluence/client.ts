import { ClientConfig, createV1Client, createV2Client } from "confluence.js";

const ENV = { ...process.env };

const confluenceCredentials: ClientConfig = {
    host: ENV.CONFLUENCE_HOST!,
    auth: {
        type: "basic",
        email: ENV.CONFLUENCE_EMAIL!,
        apiToken: ENV.CONFLUENCE_API_TOKEN!,
    }
}

export const getConfluenceClient = () => {
    // Verify required environment variables exist
    if (!(ENV.CONFLUENCE_HOST && ENV.CONFLUENCE_EMAIL && ENV.CONFLUENCE_API_TOKEN)) {
        throw new Error("Missing Confluence credentials in environment variables.");
    }

    const client1 = createV1Client(confluenceCredentials);
    const client2 = createV2Client(confluenceCredentials);

    return {
        ...client1,
        ...client2,
        ...{
            spacePermissions: {
                ...client1.spacePermissions,
                ...client2.spacePermissions
            }
        }
    };
}
