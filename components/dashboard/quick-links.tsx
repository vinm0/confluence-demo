import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, Layers, Users2, FilePlus } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

interface QuickLink {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
}

const quickLinks: QuickLink[] = [
  {
    href: "/workspaces",
    label: "Browse Workspaces",
    description: "View and manage spaces and pages.",
    icon: Layers,
  },
  {
    href: "/users",
    label: "Manage Users",
    description: "Add users, manage groups and access.",
    icon: Users2,
  },
  {
    href: "/workspaces",
    label: "Create a Page",
    description: "Start a new page in an existing workspace.",
    icon: FilePlus,
  },
];

export function QuickLinks() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {quickLinks.map(({ href, label, description, icon: Icon }) => (
        <Link key={label} href={href}>
          <Card className="h-full transition-colors hover:bg-muted/50">
            <CardContent className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{label}</span>
                  <span className="text-sm text-muted-foreground">{description}</span>
                </div>
              </div>
              <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
