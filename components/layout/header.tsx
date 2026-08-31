import type { ReactNode } from "react";

interface HeaderProps {
  title: string;
  description?: string;
  breadcrumb?: ReactNode;
  actions?: ReactNode;
}

export function Header({ title, description, breadcrumb, actions }: HeaderProps) {
  return (
    <header className="flex flex-col gap-3 border-b bg-background px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1">
        {breadcrumb && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">{breadcrumb}</div>
        )}
        <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </header>
  );
}
