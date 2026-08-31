import { NextRequest, NextResponse } from "next/server";
import { Space } from "@/lib/confluence/space";

export async function GET() {
    try {
        const spaces = await Space.getSpaces();
        return NextResponse.json(spaces.map((space) => space.data));
    } catch (error) {
        console.error("GET /api/spaces failed:", error);
        return NextResponse.json({ error: "Failed to fetch spaces." }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { key, name, description, ownerName } = body ?? {};

        if (!(key && name)) {
            return NextResponse.json({ error: "key and name are required." }, { status: 400 });
        }

        const space = await Space.createSpace({ key, name, description, ownerName });

        if (!space) {
            return NextResponse.json({ error: "Failed to create space." }, { status: 500 });
        }

        return NextResponse.json(space.data, { status: 201 });
    } catch (error) {
        console.error("POST /api/spaces failed:", error);
        return NextResponse.json({ error: "Failed to create space." }, { status: 500 });
    }
}

// Grants a group a set of space permissions (e.g. ['read'] for view-only, or
// ['read', 'create', 'update'] for collaborative access). Optionally also
// promotes a user to space admin in the same call via `adminId`.
export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const { spaceId, groupId, permissions, adminId } = body ?? {};

        if (!spaceId) {
            return NextResponse.json({ error: "spaceId is required." }, { status: 400 });
        }

        const space = await Space.getSpaceById(Number(spaceId));
        if (!space) {
            return NextResponse.json({ error: `Space ${spaceId} not found.` }, { status: 404 });
        }

        if (adminId) {
            await space.setSpaceAdmin(adminId);
        }

        if (groupId && Array.isArray(permissions) && permissions.length > 0) {
            await space.setPermissions(groupId, permissions);
        }

        return NextResponse.json(space.data);
    } catch (error) {
        console.error("PUT /api/spaces failed:", error);
        return NextResponse.json({ error: "Failed to update space permissions." }, { status: 500 });
    }
}
