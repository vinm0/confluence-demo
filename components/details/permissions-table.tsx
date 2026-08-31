import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Permission } from "@/types/domain";

const roleVariant = {
  admin: "default",
  editor: "secondary",
  viewer: "outline",
} as const;

interface PermissionsTableProps {
  permissions: Permission[];
}

export function PermissionsTable({ permissions }: PermissionsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Principal</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Source</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {permissions.map((permission) => (
          <TableRow key={permission.id}>
            <TableCell className="font-medium">{permission.principalName}</TableCell>
            <TableCell className="capitalize text-muted-foreground">
              {permission.principalType}
            </TableCell>
            <TableCell>
              <Badge variant={roleVariant[permission.role]} className="capitalize">
                {permission.role}
              </Badge>
            </TableCell>
            <TableCell className="capitalize text-muted-foreground">
              {permission.source}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
