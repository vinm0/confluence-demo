import { getConfluenceClient } from "./client";
import { Group } from "./groups";

type InitialUser = Pick<NonNullable<
    Awaited<ReturnType<ReturnType<typeof getConfluenceClient>["users"]["getUser"]>>
>, 'accountId' | 'userKey' | 'displayName' | 'email' | 'accountType'>;

class User {
    data: InitialUser

    constructor(user: InitialUser) {
        // `userKey` is legacy and Cloud API responses (e.g. group membership) rarely include
        // it anymore — `accountId` is the only identifier guaranteed to be present.
        if (!user.accountId) {
            throw new Error('Failed to generate User')
        }
        this.data = user
    }

    async getGroups() {
        try {
            const client = getConfluenceClient();
            const groupsResponse = await client.users.getGroupMembershipsForUser({ accountId: this.data.accountId! })

            const groups = groupsResponse.results?.map(g => {
                let group: Group | null = null
                try {
                    group = new Group(g)
                } catch (error) {
                    console.error(new Error('failed to create group', { cause: error }))
                }
                return group
            }).filter(Boolean)

            return (groups ?? []) as Group[]
        } catch (error) {
            throw new Error('failed to fetch groups', { cause: error })
        }
    }

    static async getCurrentUser() {
        try {
            const client = getConfluenceClient();
            const user = await client.users.getCurrentUser();

            return new User(user)
        } catch (error) {
            throw new Error('failed to fetch current user', { cause: error})
        }
    }

    // Confluence Cloud has no direct "list all users" endpoint (CQL search only indexes
    // content, not the user directory). Every licensed user is a member of the site's
    // default "confluence-users" group, so that group's membership is used as the roster,
    // filtered down to real people (excludes Slack/Teams/Opsgenie-style app/bot accounts).
    static async getUsers() {
        try {
            const groups = await Group.getGroups();
            const allUsersGroup = groups.find((group) => group.name.startsWith('confluence-users'));

            if (!allUsersGroup) {
                console.error('Could not find the default confluence-users group to list users from.');
                return [];
            }

            const members = await allUsersGroup.getUsers();
            return members.filter((user) => user.data.accountType === 'atlassian');
        } catch (error) {
            console.error("Error fetching users:", { cause: error });
            return [];
        }
    }

    static async createUser(email: string) {
        try {
            const client = getConfluenceClient();
            return await client.user.inviteByEmail({
                body: { email }
            })
        } catch (error) {
            throw new Error('faild to create user', { cause: error })
        }
    }
}

export { User };
