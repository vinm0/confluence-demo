import { Layers, FileText } from "lucide-react";

import { Header } from "@/components/layout/header";
import { StatCard } from "@/components/dashboard/stat-card";
import { QuickLinks } from "@/components/dashboard/quick-links";
import { mockPages } from "@/lib/mock-data";
import { Space } from "@/lib/confluence/space";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const spaces = await Space.getSpaces();

  return (
    <>
      <Header
        title="Dashboard"
        description="An overview of your Confluence Cloud Site."
      />
      <main className="flex-1 space-y-6 overflow-y-auto p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <StatCard label="Total Pages" value={mockPages.length} icon={FileText} />
          <StatCard label="Total Workspaces" value={spaces.length} icon={Layers} />
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground">Quick Links</h2>
          <QuickLinks />
        </div>
      </main>
    </>
  );
}
