import { NextRequest, NextResponse } from "next/server";
import { Group } from "@/lib/confluence/groups";

// With ?groupId=<id>, lists that group's users instead of all groups.
export async function GET(req: NextRequest) {
    try {
        const groupId = req.nextUrl.searchParams.get("groupId");

        if (groupId) {
            const group = new Group({ id: groupId, name: "" });
            const users = await group.getUsers();
            return NextResponse.json(users.map((user) => user.data));
        }

        const groups = await Group.getGroups();
        return NextResponse.json(groups.map((group) => ({ id: group.id, name: group.name })));
    } catch (error) {
        console.error("GET /api/groups failed:", error);
        return NextResponse.json({ error: "Failed to fetch groups." }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, description } = body ?? {};

        if (!name) {
            return NextResponse.json({ error: "name is required." }, { status: 400 });
        }

        const group = await Group.createGroup({ name, description });
        if (!group) {
            return NextResponse.json({ error: "Failed to create group." }, { status: 500 });
        }

        return NextResponse.json({ id: group.id, name: group.name }, { status: 201 });
    } catch (error) {
        console.error("POST /api/groups failed:", error);
        return NextResponse.json({ error: "Failed to create group." }, { status: 500 });
    }
}

// Adds one or more users (by account ID) to an existing group.
export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const { groupId, userIds } = body ?? {};

        if (!(groupId && Array.isArray(userIds) && userIds.length > 0)) {
            return NextResponse.json({ error: "groupId and userIds are required." }, { status: 400 });
        }

        const group = new Group({ id: groupId, name: "" });
        const result = await group.addUsersToGroup(userIds);
        return NextResponse.json({
            success: Boolean(result?.success),
            failedUserIds: result ? Array.from(result.failedUserIds) : userIds,
        });
    } catch (error) {
        console.error("PUT /api/groups failed:", error);
        return NextResponse.json({ error: "Failed to update group membership." }, { status: 500 });
    }
}
