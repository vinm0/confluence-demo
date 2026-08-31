import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { CreateGroupDialog } from "@/components/groups/create-group-dialog";
import { GroupsTable } from "@/components/groups/groups-table";
import { Group } from "@/lib/confluence/groups";

// Fetches live from Confluence on every request — without this Next.js prerenders the
// group list once at build time and serves that stale snapshot until the next deploy.
export const dynamic = "force-dynamic";

export default async function GroupsPage() {
  const groups = await Group.getGroups();

  return (
    <>
      <Header
        title="Groups"
        description="Create and manage groups, and set the default permissions their members receive."
        actions={<CreateGroupDialog />}
      />
      <main className="flex-1 space-y-4 overflow-y-auto p-6">
        <Card>
          <CardContent className="px-0">
            <GroupsTable groups={groups} />
          </CardContent>
        </Card>
      </main>
    </>
  );
}
