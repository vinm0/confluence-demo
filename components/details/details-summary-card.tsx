import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface DetailField {
  label: string;
  value: string;
}

interface DetailsSummaryCardProps {
  fields: DetailField[];
  description?: string;
}

export function DetailsSummaryCard({ fields, description }: DetailsSummaryCardProps) {
  return (
    <Card>
      <CardHeader>
        <span className="text-sm font-medium text-muted-foreground">Summary</span>
      </CardHeader>
      <CardContent className="space-y-4">
        {description && <p className="text-sm">{description}</p>}
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {fields.map((field) => (
            <div key={field.label} className="flex flex-col gap-0.5">
              <dt className="text-xs text-muted-foreground">{field.label}</dt>
              <dd className="text-sm font-medium">{field.value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}
