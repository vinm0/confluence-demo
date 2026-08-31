import { getConfluenceClient } from "./client";
import { User } from "./users";

type InitialGroup = Pick<
    NonNullable<Awaited<ReturnType<ReturnType<typeof getConfluenceClient>["group"]["getGroups"]>>["results"][number]>,
    'id' | 'name'
>;

class Group {
    id: InitialGroup["id"];
    name: InitialGroup["name"];

    constructor(group: Pick<InitialGroup, 'id' | 'name'>) {
        this.id = group.id;
        this.name = group.name;
    }

    async addUsersToGroup(userIds: number[]) {
        try {
            const retryArray: Set<number> = new Set();
            const client = getConfluenceClient();

            const addUserPromises = userIds.map((userId) => 
                client.group.addUserToGroupByGroupId({ groupId: this.id.toString(), accountId: userId.toString() })
                    .catch((error) => {
                        console.error(`Error adding user with ID ${userId} to group ${this.name}:`, { cause: error });
                        retryArray.add(userId);
                    })
                    .then(() => {
                        retryArray.delete(userId); // Remove from retry array if successful
                    })
            );

            await Promise.all(addUserPromises);

            if (retryArray.size > 0) {
                console.warn(`Retrying to add users to group ${this.name}:`, retryArray);
                await this.addUsersToGroup(Array.from(retryArray));
            }

            return {
                success: retryArray.size === 0,
                failedUserIds: retryArray,
            }
        } catch (error) {
            console.error("Error adding users to group:", { cause: error });
        }
    }

    async getUsers() {
        try {
            const client = getConfluenceClient();
            const usersResponse = await client.group.getGroupMembersByGroupId({ groupId: this.id })

            const users = usersResponse.results.map(user => new User(user))

            return users
        } catch (error) {
            throw new Error('failed to get users')
        }
    }

    static async getGroups() {
        try {
            const client = getConfluenceClient();
            const groups = await client.group.getGroups();
            const newGroups = groups.results?.map((group: InitialGroup) => {
                if (!(group?.id && group?.name)) {
                    return null; // Skip groups with missing required fields
                }
                const newGroup = new Group(group);
                return newGroup;
            })
            .filter((group): group is Group => group !== null) // Type guard to filter out nulls

            return newGroups ?? [];
        } catch (error) {
            console.error("Error fetching groups:", { cause: error });
            return [];
        }
    }

    static async getGroupById(id: number) {
        if (!id) {
            throw new Error("Group ID is required.");
        }

        try {
            const client = getConfluenceClient();
            const group = await client.group.getGroupByGroupId({ id: id.toString() });

            if (!group) {
                console.error(`Group with ID ${id} not found.`);
                return null;
            }
            if (!(group?.id && group?.name)) {
                console.error(`Group with ID ${id} is missing required fields:`, group);
                return null; // Skip groups with missing required fields
            }

            return new Group(group);
        } catch (error) {
            console.error(`Error fetching group with ID ${id}:`, { cause: error });
            return null;
        }
    }

    static async createGroup(data: { name: string; description: string }) {
        try {
            const client = getConfluenceClient();
            const groupResponse = await client.group.createGroup({
                name: data.name,
            });


            return new Group(groupResponse);
        } catch (error) {
            console.error("Error creating group:", { cause: error });
            return null;
        }
    }
}

export { Group }