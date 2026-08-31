import { ConfluenceSpace } from "@/types/domain";
import { getConfluenceClient } from "./client";

// Type for the initial space data structure from Confluence API response
type InitialSpace = NonNullable<
    Awaited<ReturnType<ReturnType<typeof getConfluenceClient>["space"]["getSpaces"]>>["results"]
>[number];

type PermissionType = 'create' | 'delete' | 'read' | 'update'

class Space {
    data: InitialSpace;

    constructor(data: InitialSpace) {
        if (!(data.id && data.key)) {
            throw new Error ('Failed to create Space')
        }
        this.data = data;
    }

    async setSpaceAdmin(userId: string) {
        try {
            const client = getConfluenceClient();
            await client.spacePermissions.addPermissionToSpace({
                spaceKey: this.data.key!,
                subject: {
                    type: 'user',
                    identifier: userId
                },
                operation: {
                    key: 'administer',
                    target: 'space'
                }
            })
        } catch (error) {
            console.error('failed to set admin')
            throw new Error('Failed to set admin', { cause: error })
        }
    }

    async setPermissions (groupId: string, permissions: PermissionType[]) {
        try {
            const client = getConfluenceClient();
            const postPermissions = async (permission: PermissionType) => {
                try {
                    return client.spacePermissions.addPermissionToSpace({
                        spaceKey: this.data.key!,
                        subject: {
                            type: 'group',
                            identifier: groupId
                        },
                        operation: {
                            target: "space",
                            key: permission
                        }
                    })
                } catch (error) {
                    console.error('failed to set permission', `${this.data.id}: ${permission}`)
                    return null
                }
            };

            const permissionsResponse = await Promise.all(permissions.map(p => {
                postPermissions(p)
            }));

            return permissionsResponse;
        } catch (error) {
            console.error('failed to set permissions', this.data.id);
            throw new Error(`failed to set permissions: ${this.data.id}`, { cause: error });
        }
    }

    async setCollaborativeSpacePermissions(adminId: string, groupId: string) {
        try {
            Promise.all([
                this.setSpaceAdmin(adminId),
                this.setPermissions(groupId, ['read', 'create', 'update'])
            ])
        } catch (error) {
            throw new Error('failed to set collaborative space permissions')
        }
    }

    async setRestrictedSpacePermissions(adminId: string, groupId: string) {
        try {
            Promise.all([
                this.setSpaceAdmin(adminId),
                this.setPermissions(groupId, ['read'])
            ])
        } catch (error) {
            throw new Error('failed to set restricted space permissions')
        }
    }

    static async createSpace(data: { key: string; name: string; description: string; ownerName: string }) {
        try {
            const spaceSummary = await getConfluenceClient().space.createSpace({
                body: {
                    key: data.key,
                    name: data.name,
                    description: data.description,
                    ownerName: data.ownerName,
                    // Add other required fields as necessary
                },
            });

            if (!spaceSummary || !spaceSummary.id) {
                throw new Error("Failed to create space or missing space ID in response.");
            }

            let id = 0; // Placeholder for the space ID, replace with actual ID from response
            try {
                id = parseInt(spaceSummary.id, 10);
            } catch (parseError) {
                console.error("Error parsing space ID:", parseError);
                throw new Error("Invalid space ID format received from Confluence API.");
            }                

            return Space.getSpaceById(id); // Assuming spaceSummary contains the
        } catch (error) {
            console.error("Error creating space:", error);
            throw new Error("Failed to create space.", { cause: error }); // Re-throw the error after logging it
        }
    }

    static async getSpaces() {
        const client = getConfluenceClient();

        try {
            const spaces = await client.space.getSpaces();

            if (!spaces || !spaces.results) {
                console.error("No spaces found or failed to fetch spaces.");
                return [];
            }

            const newSpaces = spaces.results?.map((space: InitialSpace) => {
                if (!(space?.id && space?.key && space?.name)) {
                    return null; // Skip spaces with missing required fields
                }
                const newSpace = new Space(space);

                return newSpace;
            })
            .filter((space): space is Space => space !== null) // Type guard to filter out nulls
            
            return newSpaces ?? [];
        } catch (error) {
            console.error("Error fetching spaces:", error);
            return [];
        }
    }

    static async getSpaceById(id: number) {
        if (!id) {
            throw new Error("Space ID is required.");
        }
        
        try {
            const client = getConfluenceClient();
            const space = await client.space.getSpaceById({ id });

            if (!space) {
                console.error(`Space with ID ${id} not found.`);
                return null;
            }

            if (!(space?.id && space?.key && space?.name)) {
                console.error(`Space with ID ${id} is missing required fields:`, space);
                return null; // Skip spaces with missing required fields
            }

            return new Space(space);
        } catch (error) {
            console.error(`Error fetching space with ID ${id}:`, error);
            return null;
        }
    }
}

export { Space };