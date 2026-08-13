import { Badge } from "@/components/ui/badge";

type BadgeVariant =
  | "colorAmber"
  | "colorBlue"
  | "colorPurple"
  | "colorGreen"
  | "colorSlate600"
  | "colorRed"
  | "colorOrange";

const statusVariants: Record<string, BadgeVariant> = {
  PLACED: "colorAmber",
  CONFIRMED: "colorBlue",
  PAID: "colorPurple",
  PICKED_UP: "colorGreen",
  RETURNED: "colorSlate600",
  CANCELLED: "colorRed",
  PENDING: "colorOrange",
};

const StatusBadge = ({ status }: { status: string }) => {
  return (
    <Badge size="status" variant={statusVariants[status] ?? "colorSlate600"}>
      {status.replaceAll("_", " ")}
    </Badge>
  );
};

export default StatusBadge;
