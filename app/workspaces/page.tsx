import { Header } from "@/components/layout/header";
import { CreateWorkspaceDialog } from "@/components/workspaces/create-workspace-dialog";
import { WorkspaceList } from "@/components/workspaces/workspace-list";

export default function WorkspacesPage() {
  return (
    <>
      <Header
        title="Workspaces"
        description="Spaces and the pages nested inside them."
        actions={<CreateWorkspaceDialog />}
      />
      <main className="flex-1 overflow-y-auto p-6">
        <WorkspaceList />
      </main>
    </>
  );
}
