import { NextRequest, NextResponse } from "next/server";
import { Page } from "@/lib/confluence/pages";

export async function GET(req: NextRequest) {
    try {
        const spaceIdParam = req.nextUrl.searchParams.get("spaceId");
        const spaceId = spaceIdParam ? Number(spaceIdParam) : undefined;

        const pages = await Page.getPages(spaceId);
        return NextResponse.json(pages.map((page) => page.data));
    } catch (error) {
        console.error("GET /api/pages failed:", error);
        return NextResponse.json({ error: "Failed to fetch pages." }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { spaceId, title, parentId, bodyHtml, imageUrl } = body ?? {};

        if (!(spaceId && title)) {
            return NextResponse.json({ error: "spaceId and title are required." }, { status: 400 });
        }

        const page = await Page.createPage({ spaceId, title, parentId, bodyHtml, imageUrl });
        return NextResponse.json(page.data, { status: 201 });
    } catch (error) {
        console.error("POST /api/pages failed:", error);
        return NextResponse.json({ error: "Failed to create page." }, { status: 500 });
    }
}

// Restricts a page to a single group (pass groupId) or, for a single specific user
// (pass accountId), to a dedicated group created just for them — see Page.restrictToUser.
export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const { pageId, groupId, accountId, operations } = body ?? {};

        if (!pageId) {
            return NextResponse.json({ error: "pageId is required." }, { status: 400 });
        }
        if (!(groupId || accountId)) {
            return NextResponse.json({ error: "groupId or accountId is required." }, { status: 400 });
        }

        const page = await Page.getPageById(Number(pageId));
        if (!page) {
            return NextResponse.json({ error: `Page ${pageId} not found.` }, { status: 404 });
        }

        const result = groupId
            ? await page.restrictToGroup(groupId, operations)
            : await page.restrictToUser(accountId, operations);

        return NextResponse.json(result);
    } catch (error) {
        console.error("PUT /api/pages failed:", error);
        return NextResponse.json({ error: "Failed to restrict page." }, { status: 500 });
    }
}
