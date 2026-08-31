import { NextRequest, NextResponse } from "next/server";
import { User } from "@/lib/confluence/users";
import { Group } from "@/lib/confluence/groups";

export async function GET() {
    try {
        const users = await User.getUsers();
        return NextResponse.json(users.map((user) => user.data));
    } catch (error) {
        console.error("GET /api/users failed:", error);
        return NextResponse.json({ error: "Failed to fetch users." }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email } = body ?? {};

        if (!email) {
            return NextResponse.json({ error: "email is required." }, { status: 400 });
        }

        await User.createUser(email);
        return NextResponse.json({ success: true, email }, { status: 201 });
    } catch (error) {
        console.error("POST /api/users failed:", error);
        return NextResponse.json({ error: "Failed to invite user." }, { status: 500 });
    }
}

// Adds an existing user to a group (their access is entirely a function of group
// membership — see Space.setPermissions / Page.restrictToGroup).
export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const { accountId, groupId } = body ?? {};

        if (!(accountId && groupId)) {
            return NextResponse.json({ error: "accountId and groupId are required." }, { status: 400 });
        }

        const group = await Group.getGroupById(Number(groupId));
        if (!group) {
            return NextResponse.json({ error: `Group ${groupId} not found.` }, { status: 404 });
        }

        const result = await group.addUsersToGroup([accountId]);
        return NextResponse.json({ success: Boolean(result?.success) });
    } catch (error) {
        console.error("PUT /api/users failed:", error);
        return NextResponse.json({ error: "Failed to update user's group membership." }, { status: 500 });
    }
}
