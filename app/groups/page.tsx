import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { CreateGroupDialog } from "@/components/groups/create-group-dialog";
import { GroupsTable } from "@/components/groups/groups-table";

export default function GroupsPage() {
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
            <GroupsTable />
          </CardContent>
        </Card>
      </main>
    </>
  );
}
