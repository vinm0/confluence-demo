import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { CreateUserDialog } from "@/components/users/create-user-dialog";
import { UserFilters } from "@/components/users/user-filters";
import { UsersTable } from "@/components/users/users-table";
import { User } from "@/lib/confluence/users";
import { Group } from "@/lib/confluence/groups";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const [users, groups] = await Promise.all([User.getUsers(), Group.getGroups()]);

  return (
    <>
      <Header
        title="User Management"
        description="Manage users and site access."
        actions={<CreateUserDialog />}
      />
      <main className="flex-1 space-y-4 overflow-y-auto p-6">
        <UserFilters groups={groups} />
        <Card>
          <CardContent className="px-0">
            <UsersTable users={users} />
          </CardContent>
        </Card>
      </main>
    </>
  );
}
