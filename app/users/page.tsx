import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { CreateUserDialog } from "@/components/users/create-user-dialog";
import { UserFilters } from "@/components/users/user-filters";
import { UsersTable } from "@/components/users/users-table";

export default function UsersPage() {
  return (
    <>
      <Header
        title="User Management"
        description="Manage users and site access."
        actions={<CreateUserDialog />}
      />
      <main className="flex-1 space-y-4 overflow-y-auto p-6">
        <UserFilters />
        <Card>
          <CardContent className="px-0">
            <UsersTable />
          </CardContent>
        </Card>
      </main>
    </>
  );
}
