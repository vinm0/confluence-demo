import { getConfluenceClient } from "./client";
import { Group } from "./groups";

type InitialPage = NonNullable<
    Awaited<ReturnType<ReturnType<typeof getConfluenceClient>["page"]["createPage"]>>
>;

type RestrictableOperation = 'read' | 'update';

// Confluence storage-format body used when the caller doesn't supply their own content.
// Good enough to prove out page creation without requiring real copy up front.
const LOREM_IPSUM_BODY = `
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sed erat nec turpis
    fermentum blandit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere
    cubilia curae; Sed euismod, nisl nec tincidunt lacinia, nunc justo aliquet enim.</p>
    <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
    commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
    dolore eu fugiat nulla pariatur.</p>
`;

// Placeholder image referenced by URL so page creation doesn't require an attachment upload.
const DEFAULT_IMAGE_URL = 'https://picsum.photos/800/400';

class Page {
    data: InitialPage;

    constructor(data: InitialPage) {
        if (!(data.id && data.title)) {
            throw new Error('Failed to create Page')
        }
        this.data = data;
    }

    // Restricts a single Confluence operation (view or edit) on this page to one specific group,
    // meaning nobody else can perform that operation once the restriction is in place. Restrictions
    // are assigned to groups only — an individual user is granted access by being a member of the
    // restricted group, not by restricting the page to their account directly.
    async restrictToGroup(groupId: string, operations: RestrictableOperation[] = ['read', 'update']) {
        if (!groupId) {
            throw new Error("A group ID is required to restrict this page.");
        }

        try {
            const client = getConfluenceClient();

            await Promise.all(operations.map((operationKey) =>
                client.contentRestrictions.addGroupToContentRestrictionByGroupId({
                    id: this.data.id!,
                    operationKey,
                    groupId,
                })
            ));

            return { success: true, groupId, operations };
        } catch (error) {
            console.error(`Error restricting page ${this.data.id} to group ${groupId}:`, { cause: error });
            throw new Error('Failed to restrict page to group', { cause: error });
        }
    }

    // Grants sole access to this page to one specific user. Restrictions are group-only (see
    // `restrictToGroup`), so this creates a dedicated single-member group for the user and
    // restricts the page to that group rather than to the user's account directly.
    async restrictToUser(accountId: number, operations: RestrictableOperation[] = ['read', 'update']) {
        if (!accountId) {
            throw new Error("A user account ID is required to restrict this page.");
        }

        try {
            const group = await Group.createGroup({
                name: `page-${this.data.id}-${accountId}-access`,
                description: `Grants sole access to page ${this.data.id} for user ${accountId}.`,
            });

            if (!group) {
                throw new Error(`Failed to create restriction group for page ${this.data.id}.`);
            }

            const addResult = await group.addUsersToGroup([accountId]);
            if (!addResult?.success) {
                throw new Error(`Failed to add user ${accountId} to restriction group ${group.name}.`);
            }

            await this.restrictToGroup(group.id, operations);

            return { success: true, accountId, groupId: group.id, operations };
        } catch (error) {
            console.error(`Error restricting page ${this.data.id} to user ${accountId}:`, { cause: error });
            throw new Error('Failed to restrict page to user', { cause: error });
        }
    }

    // Builds the Confluence storage-format body: lorem ipsum copy plus one embedded image.
    static buildBody(options?: { bodyHtml?: string; imageUrl?: string }) {
        const bodyHtml = options?.bodyHtml ?? LOREM_IPSUM_BODY;
        const imageUrl = options?.imageUrl ?? DEFAULT_IMAGE_URL;

        return `
            ${bodyHtml}
            <ac:image ac:align="center" ac:layout="center" ac:width="600">
                <ri:url ri:value="${imageUrl}" />
            </ac:image>
        `.trim();
    }

    static async createPage(data: {
        spaceId: string;
        title: string;
        parentId?: string;
        bodyHtml?: string;
        imageUrl?: string;
    }) {
        if (!(data.spaceId && data.title)) {
            throw new Error("A space ID and title are required to create a page.");
        }

        try {
            const client = getConfluenceClient();
            const page = await client.page.createPage({
                body: {
                    spaceId: data.spaceId,
                    status: 'current',
                    title: data.title,
                    parentId: data.parentId,
                    body: {
                        representation: 'storage',
                        value: Page.buildBody({ bodyHtml: data.bodyHtml, imageUrl: data.imageUrl }),
                    },
                },
            });

            if (!page || !page.id) {
                throw new Error("Failed to create page or missing page ID in response.");
            }

            return new Page(page);
        } catch (error) {
            console.error("Error creating page:", { cause: error });
            throw new Error("Failed to create page.", { cause: error });
        }
    }

    static async getPages(spaceId?: number) {
        try {
            const client = getConfluenceClient();
            const pages = await client.page.getPages(spaceId ? { spaceId: [spaceId] } : undefined);

            if (!pages || !pages.results) {
                console.error("No pages found or failed to fetch pages.");
                return [];
            }

            const newPages = pages.results
                .map((page) => {
                    if (!(page?.id && page?.title)) {
                        return null; // Skip pages with missing required fields
                    }
                    return new Page(page);
                })
                .filter((page): page is Page => page !== null);

            return newPages;
        } catch (error) {
            console.error("Error fetching pages:", { cause: error });
            return [];
        }
    }

    static async getPageById(id: number) {
        if (!id) {
            throw new Error("Page ID is required.");
        }

        try {
            const client = getConfluenceClient();
            const page = await client.page.getPageById({ id });

            if (!page) {
                console.error(`Page with ID ${id} not found.`);
                return null;
            }
            if (!(page?.id && page?.title)) {
                console.error(`Page with ID ${id} is missing required fields:`, page);
                return null; // Skip pages with missing required fields
            }

            return new Page(page);
        } catch (error) {
            console.error(`Error fetching page with ID ${id}:`, { cause: error });
            return null;
        }
    }
}

export { Page };
